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

