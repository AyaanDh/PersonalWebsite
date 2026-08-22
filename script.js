const graph = document.getElementById("contributionGraph");
const contributionCount = document.getElementById("contributionCount");
const tooltip = document.getElementById("tooltip");
const months = document.getElementById("months");

async function loadContributions() {
    try {
        const response = await fetch(
            "https://github-contributions-api.jogruber.de/v4/ayaandh?y=2026"
        );

        if (!response.ok) {
            throw new Error("Failed to fetch GitHub data");
        }

        const data = await response.json();

        const contributionData = new Map(
            data.contributions.map(day => [day.date, day])
        );

        const total = data.total["2026"] ?? 0;

        contributionCount.innerHTML =
            `<strong>${total}</strong> Contributions in 2026`;

        const start = new Date("2025-12-28T00:00:00");
        const end = new Date("2027-01-02T00:00:00");

        const dates = [];

        for (
            let date = new Date(start);
            date <= end;
            date.setDate(date.getDate() + 1)
        ) {
            dates.push(new Date(date));
        }

        graph.innerHTML = "";

        dates.forEach(date => {
            const iso = date.toISOString().split("T")[0];
            const day = document.createElement("div");

            day.className = "day";

            if (date.getFullYear() !== 2026) {
                day.style.visibility = "hidden";
                graph.appendChild(day);
                return;
            }

            const contribution = contributionData.get(iso);

            day.dataset.level = contribution?.level ?? 0;

            day.addEventListener("mouseenter", event => {
                const count = contribution?.count ?? 0;

                const formattedDate = date.toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                });

                tooltip.textContent =
                    `${count} contribution${count === 1 ? "" : "s"} on ${formattedDate}`;

                tooltip.style.display = "block";
                tooltip.style.left = `${event.clientX + 12}px`;
                tooltip.style.top = `${event.clientY - 12}px`;
            });

            day.addEventListener("mousemove", event => {
                tooltip.style.left = `${event.clientX + 12}px`;
                tooltip.style.top = `${event.clientY - 12}px`;
            });

            day.addEventListener("mouseleave", () => {
                tooltip.style.display = "none";
            });

            graph.appendChild(day);
        });

        createMonthLabels();

    } catch (error) {
        console.error(error);

        contributionCount.textContent =
            "Unable to load contributions";

        graph.innerHTML = "";
    }
}

function createMonthLabels() {
    months.innerHTML = "";

    const start = new Date("2025-12-28T00:00:00");
    const monthsSeen = new Set();

    for (let week = 0; week < 54; week++) {
        const date = new Date(start);

        date.setDate(
            start.getDate() + week * 7
        );

        if (date.getFullYear() !== 2026) {
            continue;
        }

        const month = date.toLocaleDateString("en-GB", {
            month: "short"
        });

        const key = `${date.getFullYear()}-${date.getMonth()}`;

        if (monthsSeen.has(key)) {
            continue;
        }

        monthsSeen.add(key);

        const label = document.createElement("span");

        label.className = "month-label";
        label.textContent = month;
        label.style.left = `${week * 17}px`;

        months.appendChild(label);
    }
}

loadContributions();