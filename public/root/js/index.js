const form = document.querySelector("form#get-user-form");

async function handleSubmit(e) {
    e.preventDefault();
    const form = new FormData(this);
    const username = form.get("get-username");

    if (!username) {
        // send an error message but for now we console.log
        return console.log("Add a username you bozo");
    }

    const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username: username, isLoggedIn: true,
        })
    })

    await response.json();

    if (response.ok) {
        window.location.href = "http://localhost:3000/chat"
    }  else {
        console.log(response);
    }
    
}

form.onsubmit = handleSubmit;
