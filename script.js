const createId = () =>
  window.crypto?.randomUUID
    ? window.crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const items = [
  {
    id: createId(),
    title: 'Define success metrics',
    owner: 'AB',
    status: 'backlog',
  },
  {
    id: createId(),
    title: 'Design campaign page',
    owner: 'JS',
    status: 'progress',
  },
  {
    id: createId(),
    title: 'Enable billing integration',
    owner: 'MT',
    status: 'progress',
  },
  {
    id: createId(),
    title: 'QA automation suite',
    owner: 'LW',
    status: 'done',
  },
];

const statusLabels = {
  backlog: 'Backlog',
  progress: 'In Progress',
  done: 'Done',
};

const columns = {
  backlog: document.getElementById('backlog'),
  progress: document.getElementById('progress'),
  done: document.getElementById('done'),
};

const modal = document.getElementById('new-item-modal');
const addItemButton = document.getElementById('add-item-btn');
const newItemForm = document.getElementById('new-item-form');
const itemTemplate = document.getElementById('item-template');
const yearEl = document.getElementById('year');
const signupForm = document.getElementById('signup-form');

yearEl.textContent = new Date().getFullYear();

signupForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(signupForm);
  const email = formData.get('email');
  const existingMessage = signupForm.nextElementSibling;
  if (existingMessage?.classList.contains('success')) {
    existingMessage.remove();
  }
  signupForm.reset();
  signupForm.dataset.state = 'success';
  signupForm.insertAdjacentHTML(
    'afterend',
    `<p class="success">Thanks! A demo invite is on its way to <strong>${email}</strong>.</p>`
  );
});

function createItemElement(item) {
  const fragment = itemTemplate.content.cloneNode(true);
  const article = fragment.querySelector('.board-item');
  article.dataset.id = item.id;
  article.dataset.status = item.status;

  article.addEventListener('dragstart', handleDragStart);
  article.addEventListener('dragend', handleDragEnd);

  const avatar = fragment.querySelector('[data-avatar]');
  avatar.textContent = (item.owner || 'NA').slice(0, 2).toUpperCase();

  const title = fragment.querySelector('[data-title]');
  title.textContent = item.title;

  const statusLabel = fragment.querySelector('[data-status-label]');
  statusLabel.textContent = statusLabels[item.status];

  return fragment;
}

function renderBoard() {
  Object.values(columns).forEach((column) => {
    column.textContent = '';
  });

  items.forEach((item) => {
    columns[item.status].appendChild(createItemElement(item));
  });
}

function handleDragStart(event) {
  event.dataTransfer.setData('text/plain', event.target.dataset.id);
  event.dataTransfer.effectAllowed = 'move';
  requestAnimationFrame(() => event.target.classList.add('is-dragging'));
}

function handleDragEnd(event) {
  event.target.classList.remove('is-dragging');
}

function handleDragOver(event) {
  event.preventDefault();
  event.dataTransfer.dropEffect = 'move';
  event.currentTarget.classList.add('drag-over');
}

function handleDrop(event) {
  event.preventDefault();
  const id = event.dataTransfer.getData('text/plain');
  const nextStatus = event.currentTarget.dataset.status;
  const item = items.find((i) => i.id === id);
  if (!item || item.status === nextStatus) return;
  item.status = nextStatus;
  renderBoard();
}

function handleDragLeave(event) {
  event.currentTarget.classList.remove('drag-over');
}

Object.values(columns).forEach((columnWrapper) => {
  const column = columnWrapper.closest('.column');
  column.addEventListener('dragover', handleDragOver);
  column.addEventListener('drop', (event) => {
    handleDrop(event);
    column.classList.remove('drag-over');
  });
  column.addEventListener('dragleave', handleDragLeave);
});

addItemButton.addEventListener('click', () => {
  newItemForm.reset();
  modal.showModal();
});

modal.addEventListener('cancel', () => {
  modal.close();
});

newItemForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(newItemForm);
  const title = data.get('title');
  const owner = data.get('owner');
  const status = data.get('status');

  items.push({
    id: createId(),
    title,
    owner,
    status,
  });

  renderBoard();
  modal.close();
});

renderBoard();
