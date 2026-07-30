const username = "ayaandh";

async function loadGithubDashboard(){

    const user = await fetch(
        `https://api.github.com/users/${username}`
    ).then(r => r.json());


    document.querySelector("#avatar").src = user.avatar_url;

    document.querySelector("#username").textContent =
        user.name || username;

    document.querySelector("#bio").textContent =
        user.bio || "Building software and open-source projects.";


    const repos = await fetch(
        `https://api.github.com/users/${username}/repos?per_page=100`
    ).then(r => r.json());


    let stars = 0;
    let forks = 0;
    let languages = {};


    repos.forEach(repo => {

        stars += repo.stargazers_count;

        forks += repo.forks_count;


        if(repo.language){

            languages[repo.language] =
                (languages[repo.language] || 0) + 1;

        }

    });


    document.querySelector("#repos").textContent =
        user.public_repos;

    document.querySelector("#followers").textContent =
        user.followers;

    document.querySelector("#stars").textContent =
        stars;

    document.querySelector("#forks").textContent =
        forks;


    const sortedLanguages = Object.entries(languages)
        .sort((a,b)=>b[1]-a[1])
        .slice(0,5);


    const totalLanguages = sortedLanguages.reduce(
        (sum, lang)=>sum + lang[1],
        0
    );


    const languageContainer =
        document.querySelector("#language-list");


    languageContainer.innerHTML = "";


    sortedLanguages.forEach(lang => {

        const percentage = Math.round(
            (lang[1] / totalLanguages) * 100
        );


        languageContainer.innerHTML += `

        <div class="language-row">

            <div class="language-name">

                <span>${lang[0]}</span>

                <span>${percentage}%</span>

            </div>


            <div class="bar">

                <div style="width:${percentage}%"></div>

            </div>

        </div>

        `;

    });


    const recentContainer =
        document.querySelector("#recent-projects");


    recentContainer.innerHTML = "";


    repos
        .sort(
            (a,b)=>
            new Date(b.updated_at)
            -
            new Date(a.updated_at)
        )
        .slice(0,4)
        .forEach(repo => {

            recentContainer.innerHTML += `

            <a href="${repo.html_url}" target="_blank">

                <h4>${repo.name}</h4>

                <p>
                    ${repo.description || "No description available."}
                </p>

            </a>

            `;

        });

}


loadGithubDashboard();