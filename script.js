let attractions = [];

async function loadData() {

    try {

        const response = await fetch("./data.json");

        if (!response.ok) {

            throw new Error("data.jsonを読み込めませんでした");

        }

        attractions = await response.json();

        console.log("読み込んだデータ:", attractions);

        render();

    } catch (error) {

        console.error("データ読み込みエラー:", error);

        list.innerHTML = `

            <div class="card">

                <h2>⚠️ データを読み込めません</h2>

                <p>data.jsonが正しく読み込まれていません。</p>

            </div>

        `;

    }

}

const list = document.getElementById("list");

const search = document.getElementById("search");

const crowd = document.getElementById("crowd");

const time = document.getElementById("time");

const reload = document.getElementById("reload");

function getClass(wait) {

    if (wait < 0) return "closed";

    if (wait < 30) return "green";

    if (wait < 60) return "yellow";

    return "red";

}

function getText(wait) {

    if (wait < 0) return "休止中";

    return wait + "分";

}

function render(keyword = "") {

    list.innerHTML = "";

    const filtered = attractions.filter(a =>

        a.name.includes(keyword)

    );

    filtered.forEach(a => {

        const card = document.createElement("div");

        card.className = "card";

        card.innerHTML = `

        <img src="${a.image}" class="photo">

        <h2>${a.name}</h2>
        
        <p>${a.area}</p>
        
        <p>${a.description}</p>
        
        <div class="wait ${getClass(a.wait)}">
        
        ${a.status == "closed" ? "休止中" : a.wait + "分"}
        
        </div>

        `;

        list.appendChild(card);

    });

    updateInfo();

}

function updateInfo() {

    let total = 0;

    let count = 0;

    attractions.forEach(a => {

        if (a.wait >= 0) {

            total += a.wait;

            count++;

        }

    });

    const avg = total / count;

    let stars = "";

    if (avg < 20) {

        stars = "★☆☆☆☆";

    } else if (avg < 40) {

        stars = "★★☆☆☆";

    } else if (avg < 60) {

        stars = "★★★☆☆";

    } else if (avg < 80) {

        stars = "★★★★☆";

    } else {

        stars = "★★★★★";

    }

    crowd.textContent = "混雑状況 " + stars;

    const now = new Date();

    const h = String(now.getHours()).padStart(2, "0");

    const m = String(now.getMinutes()).padStart(2, "0");

    time.textContent = "最終更新 " + h + ":" + m;

}

search.addEventListener("input", e => {

    render(e.target.value);

});

reload.addEventListener("click", () => {

    render(search.value);

});

loadData();