  // Nav Sort
  document.addEventListener('DOMContentLoaded', () => {
    const sortToggle = document.getElementById('sortToggle');
    const sortForm = document.getElementById('sortForm');
    const clearSort = document.getElementById('clearSort');

    // Restore previous visibility state
    const isSortOpen = localStorage.getItem('sortFormVisible') === 'true';
    if (isSortOpen) {
      sortForm.classList.remove('hidden');
    }

    // Toggle visibility on sort button click
    sortToggle?.addEventListener('click', () => {
      sortForm.classList.toggle('hidden');
      const currentlyVisible = !sortForm.classList.contains('hidden');
      localStorage.setItem('sortFormVisible', currentlyVisible);
    });

    // Clear visibility preference when "Clear" is clicked
    clearSort?.addEventListener('click', () => {
      localStorage.removeItem('sortFormVisible');
    });
  });

  // modal

  

  document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("confirmationModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalMessage = document.getElementById("modalMessage");
  const modalForm = document.getElementById("modalForm");
  const cancelBtn = document.getElementById("cancelBtn");
  const confirmBtn = document.getElementById("confirmBtn");

    // Open modal with custom content
    window.openModal = ({title = "Are you sure?", message, action, confirmLabel = "Confirm"}) => {
      modalTitle.textContent = title;
      modalMessage.innerHTML = message;
      modalForm.setAttribute("action", action);
      confirmBtn.innerHTML = confirmLabel;

      modal.classList.add("show");
      modal.classList.remove("hidden");
    }

  const closeModal = function () {
    modal.classList.remove("show");
    setTimeout(() => modal.classList.add("hidden"), 300);
    modalForm.removeAttribute("action");
  };

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal(); 
  });

  cancelBtn.addEventListener("click", closeModal);

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.classList.contains('show')){
      closeModal();
    }
  });

  //Trigger modal via data-* attributes
  document.querySelectorAll(".open-modal-btn").forEach(button => {
    button.addEventListener("click", () => {
      const title = button.getAttribute("data-title");
      const message = button.getAttribute("data-message");
      const action = button.getAttribute("data-action");
      const confirmLabel = button.getAttribute("data-label");

      openModal({ title, message, action, confirmLabel });
    });
  });
});


