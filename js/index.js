// Obtain form from HTML
const form = document.getElementById("github-form");

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const inputValue = document.getElementById("search");
    const search = inputValue.value.trim(); // Remove leading/trailing whitespace
    const fetchUrl = `https://api.github.com/search/users?q=${search}`;

    try {
        const response = await fetch(fetchUrl, {
            method: "GET",
            headers: {
                'Accept': 'application/vnd.github.v3+json',
            },
        });

        if (response.ok) {
            const data = await response.json();
            const ulUserList = document.getElementById('user-list');
            ulUserList.innerHTML = '';

            data.items.forEach(user => {
                const liUserList = document.createElement('li');
                liUserList.innerHTML = `
                    <img src="${user.avatar_url}" alt="${user.login}" />
                    <p>${user.login}</p>
                    <a href="${user.html_url}" target="_blank">Profile</a>
                `;

                // Add a click event listener to each user item
                liUserList.addEventListener('click', async () => {
                    await fetchUserRepositories(user.login);
                });

                ulUserList.appendChild(liUserList);
            });
        } else {
            console.error('Error fetching user data:', response.statusText);
        }
    } catch (error) {
        console.error("Fetch error:", error);
    }
});

async function fetchUserRepositories(username) {
    const fetchUserRepo = `https://api.github.com/users/${username}/repos`;

    try {
        const res = await fetch(fetchUserRepo, {
            method: 'GET',
            headers: {
                'Accept': 'application/vnd.github.v3+json',
            },
        });

        if (res.ok) {
            const data = await res.json();
            const ulRepoList = document.getElementById('repos-list');
            ulRepoList.innerHTML = '';

            data.forEach(repo => {
                const liRepoData = document.createElement('li');
                liRepoData.innerHTML = `
                    <a href="${repo.html_url}" target="_blank">${repo.name}</a>
                `;

                ulRepoList.appendChild(liRepoData);
            });
        } else {
            console.error('Error fetching user repositories:', res.statusText);
        }
    } catch (error) {
        console.error("Fetch error:", error);
    }
}
