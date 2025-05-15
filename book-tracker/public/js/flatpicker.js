flatpickr("#datePicker", {
    dateFormat: "Y-m-d",
    allowInput: true,
    onReady: function(_, __, fp) {
      fp._input.placeholder = ""; // Remove default placeholder
    }
  });