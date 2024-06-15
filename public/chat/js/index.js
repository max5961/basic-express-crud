const form = document.querySelector("form#send-message");

form.onsubmit = handleSubmit;

async function handleSubmit(e) {
    e.preventDefault();
    const form = new FormData(this);
    const message = form.get("get-message");

    if (!message) {
        return console.log("send a message next time bro");
    }

    const response = await fetch("http://localhost:3000/chat/api/chatlog", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({message})
    })

    const data = await response.json();

    if (response.ok) {
        handleData(data);
    } else {
        console.log(response);
    }
}

/* Clears and populates DOM with data */
function handleData(data) {
    const messages = document.querySelector(".messages");

    if (!messages) return console.log("You bozo");

    messages.innerHTML = "";
    const input = document.querySelector("form#send-message input");
    input.value = "";
    input.focus();
    

    for (const message of data) {
        messages.appendChild(createMessage(message));
    }
}

function createMessage(message) {
    const messageElem = document.createElement("div");
    messageElem.classList.add(`message`);
    messageElem.classList.add(`server-id-${message.id}`);

    /* Append text */
    const p = document.createElement("p");
    p.textContent = `id: ${message.id}: '${message.username}' posted: ${message.message}`;
    messageElem.appendChild(p);

    /* Append delete button */
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = `Delete id: ${message.id}`;
    deleteBtn.onclick = () => handleDelete(message.id);
    messageElem.appendChild(deleteBtn);

    const editBtn = document.createElement("button");
    editBtn.textContent = `Edit id: ${message.id}`;
    editBtn.id = message.id;
    editBtn.onclick = () => handleEdit(message);
    messageElem.appendChild(editBtn);


    return messageElem;
}

async function handleDelete(id) {
    const response = await fetch(`http://localhost:3000/chat/api/chatlog/${id}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        return console.log(response);
    } 

    const data = await response.json();
    handleData(data); 
}

async function handleEdit(message) {
    const post = document.querySelector(`.message.server-id-${message.id}`);
    post.innerHTML = `
        <form action="" id="edit-message-form">
            <label for="edit-message"></label>
            <input type="text" name="edit-message" id="edit-message">
            <button type="submit">Submit Changes</button>
        </form>
    `

    const input = document.querySelector("form#edit-message-form input");
    input.value = message.message;
    
    const label = document.querySelector("form#edit-message-form label");
    label.textContent = `Editing Message ${message.id}`;

    const form = document.querySelector("form#edit-message-form");
    form.onsubmit = (e) => handleEditSubmit(e, message, form);
}

async function handleEditSubmit(e, messageObj, form) {
    e.preventDefault();
    const editForm = new FormData(form);
    const message = editForm.get("edit-message");

    if (!message) {
        return console.log("enter somethign dummy");
    }

    const response = await fetch(`http://localhost:3000/chat/api/chatlog`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({message, id: messageObj.id, username: messageObj.username})
    });

    if (!response.ok) {
        return console.log(response);
    }

    const data = await response.json();
    console.log(data);

    handleData(data);  
}

