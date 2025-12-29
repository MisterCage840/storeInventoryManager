let pendingDeleteForm = null

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("deleteModal")
  const passInput = document.getElementById("deletePasswordInput")
  const cancelBtn = document.getElementById("deleteCancelBtn")
  const confirmBtn = document.getElementById("deleteConfirmBtn")

  if (!modal || !passInput || !cancelBtn || !confirmBtn) return

  // Intercept any form that posts to a /delete endpoint
  document.querySelectorAll('form[action*="/delete"]').forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault()
      pendingDeleteForm = form

      modal.classList.remove("hidden")
      modal.setAttribute("aria-hidden", "false")
      passInput.value = ""
      passInput.focus()
    })
  })

  const close = () => {
    modal.classList.add("hidden")
    modal.setAttribute("aria-hidden", "true")
    pendingDeleteForm = null
  }

  cancelBtn.addEventListener("click", close)

  // Close modal if clicking outside the card
  modal.addEventListener("click", (e) => {
    if (e.target === modal) close()
  })

  function showError(message) {
    let error = document.getElementById("deleteError")

    if (!error) {
      error = document.createElement("div")
      error.id = "deleteError"
      error.className = "modal-error"
      error.textContent = message
      passInput.after(error)
    } else {
      error.textContent = message
    }

    passInput.classList.add("input-error")

    // shake animation
    passInput.classList.remove("shake")
    void passInput.offsetWidth
    passInput.classList.add("shake")
  }

  // inside the form submit intercept
  passInput.classList.remove("input-error")
  const error = document.getElementById("deleteError")
  if (error) error.remove()

  confirmBtn.addEventListener("click", async () => {
    if (!pendingDeleteForm) return

    const password = passInput.value.trim()
    if (!password) {
      passInput.focus()
      return
    }

    // build form data manually
    const params = new URLSearchParams()
    params.set("deletePassword", password)

    try {
      const res = await fetch(pendingDeleteForm.action, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      })

      if (res.ok) {
        // success → redirect or reload
        window.location.href = "/ingredients"
        return
      }

      if (res.status === 403) {
        showError("Incorrect password")
        return
      }

      showError("Something went wrong")
    } catch {
      showError("Network error")
    }
  })

  // ESC to close
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) close()
  })
})
