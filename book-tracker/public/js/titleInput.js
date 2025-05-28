   console.log("im TitleInputJS");

  const textarea = document.getElementById('title');

  const autoResize = (el) => {
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  };

  // On input
  textarea.addEventListener('input', () => autoResize(textarea));

  // On load (for pre-filled content)
  window.addEventListener('DOMContentLoaded', () => autoResize(textarea));

 
