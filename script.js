let items = [];
let editingId = null;

document.getElementById('addItemBtn').addEventListener('click', addItem);
document.getElementById('newItemInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addItem();
    }
});

function addItem() {
    const input = document.getElementById('newItemInput');
    const name = input.value.trim();

    if (name === '') return;

    const item = {
        id: Date.now(),
        name: name,
        quantity: 1,
        bought: false
    };

    items.push(item);
    saveToLocalStorage();
    input.value = '';
    renderItems();
    updateStats();
}

function deleteItem(id) {
    items = items.filter(item => item.id !== id);
    saveToLocalStorage();
    renderItems();
    updateStats();
}

function toggleBought(id) {
    const item = items.find(item => item.id === id);

    if (item) {
        item.bought = !item.bought;
        saveToLocalStorage();
        renderItems();
        updateStats();
    }
}

function changeQuantity(id, delta) {
    const item = items.find(item => item.id === id);
    if (item) {
        item.quantity = Math.max(1, item.quantity + delta);
        saveToLocalStorage();
        renderItems();
        updateStats();
    }
}

function startEdit(id) {
    editingId = id;
    renderItems();
}

function saveEdit(id, newName) {
    const item = items.find(item => item.id === id);
    if (item && newName.trim() !== '') {
        item.name = newName.trim();
    }
    editingId = null;
    saveToLocalStorage();
    renderItems();
    updateStats();
}

function cancelEdit() {
    editingId = null;
    renderItems();
}

function renderItems() {
    const itemsList = document.getElementById('itemsList');
    itemsList.innerHTML = '';

    items.forEach(item => {
        const li = document.createElement('li');
        li.className = 'item';

        const isEditing = editingId === item.id;

        li.innerHTML = `
                <div class="item-name ${item.bought ? 'bought' : ''}">
                    ${isEditing ?
            `<input type="text" value="${item.name}" onblur="saveEdit(${item.id}, this.value)" onkeypress="handleEditKeypress(event, ${item.id}, this.value)" autofocus>` :
            `<span onclick="startEdit(${item.id})">${item.name}</span>`
        }
                </div>
                <div class="item-controls">
                    ${!item.bought ? `
                        <div class="quantity-controls">
                            <button data-tooltip="Зменшити кiлькiсть" class="quantity-btn minus" onclick="changeQuantity(${item.id}, -1)" ${item.quantity <= 1 ? 'disabled' : ''}>−</button>
                            <span class="quantity-value">${item.quantity}</span>
                            <button data-tooltip="Збiльшити кiлькiсть" class="quantity-btn plus" onclick="changeQuantity(${item.id}, 1)">+</button>
                        </div>
                    ` : ''}

                    <button data-tooltip="${item.bought ? 'Позначити як не куплено' : 'Позначити як куплено'}"
                        class="status-btn ${item.bought ? 'bought' : ''}" onclick="toggleBought(${item.id})">
                        ${item.bought ? 'Куплено' : 'Не куплено'}
                    </button>
                    ${!item.bought ? `<button class="delete-btn" onclick="deleteItem(${item.id})" data-tooltip="Видалити товар">×</button>` : ''}

                </div>
            `;

        itemsList.appendChild(li);
    });
}

function handleEditKeypress(event, id, value) {
    if (event.key === 'Enter') {
        saveEdit(id, value);
    } else if (event.key === 'Escape') {
        cancelEdit();
    }
}

function updateStats() {
    const toBuyStats = document.getElementById('toBuyStats');
    const boughtStats = document.getElementById('boughtStats');

    const toBuyItems = items.filter(item => !item.bought);
    const boughtItems = items.filter(item => item.bought);

    toBuyStats.innerHTML = '';
    toBuyItems.forEach(item => {
        const tag = document.createElement('div');
        tag.className = 'stats-tag';
        tag.innerHTML = `
                <span>${item.name}</span>
                <span class="quantity">${item.quantity}</span>
            `;
        toBuyStats.appendChild(tag);
    });

    boughtStats.innerHTML = '';
    boughtItems.forEach(item => {
        const tag = document.createElement('div');
        tag.className = 'stats-tag';
        tag.innerHTML = `
                <span class="item-name ${item.bought ? 'crossed' : ''}">${item.name}</span>
                <span class="quantity">${item.quantity}</span>
            `;
        boughtStats.appendChild(tag);
    });
}

function saveToLocalStorage() {
    localStorage.setItem('shoppingListItems', JSON.stringify(items));
}

function loadFromLocalStorage() {
    const savedItems = localStorage.getItem('shoppingListItems');
    if (savedItems) {
        items = JSON.parse(savedItems);
    }
}

loadFromLocalStorage();

if (items.length === 0) {
    items = [
        { id: 1, name: 'Помідори', quantity: 2, bought: false },
        { id: 2, name: 'Печиво', quantity: 2, bought: false },
        { id: 3, name: 'Сир', quantity: 1, bought: false }
    ];
    saveToLocalStorage();
}

renderItems();
updateStats();