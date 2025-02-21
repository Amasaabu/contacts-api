// Mock API functions
const HOST = ""
const APIFUNCTIONS = {
    getContacts: async () => {
    const contact =  await fetch(`${HOST}/api/contacts`)
    return await contact.json()
    },
    addContact: async(contact) => {
      return await fetch(`${HOST}/api/contacts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contact),
      })
    },
    updateContact:async (contact, id) => {
    console.log(contact);
      return await fetch(`${HOST}/api/contacts/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contact),
      })
    },
    deleteContact: async(id) => {
      const response = await fetch(`${HOST}/api/contacts/${id}`, {
        method: "DELETE",
      })
        return await response.json()
    },
  }
  
  // DOM elements
  const contactForm = document.getElementById("contactForm")
  const contactItems = document.getElementById("contactItems")
  const submitBtn = document.getElementById("submitBtn")
  const searchInput = document.getElementById("searchInput")
  
  // State
  let contacts = []
  let editingContact = null
  
  // Load contacts on page load
  document.addEventListener("DOMContentLoaded", loadContacts)
  
  // Event listeners
  contactForm.addEventListener("submit", handleFormSubmit)
  searchInput.addEventListener("input", handleSearch)
  
  // Functions
  async function loadContacts() {
    contacts = await APIFUNCTIONS.getContacts()
    console.log(contacts);
    renderContacts()
  }
  
  function renderContacts(contactsToRender = contacts) {
    contactItems.innerHTML = ""
    contactsToRender.forEach((contact) => {
      const li = document.createElement("li")
      li.className = "contact-item"
      li.innerHTML = `
              <div class="contact-info">
                  <strong>${contact.firstName} ${contact.lastName}</strong>
                  <p>Phone: ${contact.phone}</p>
                  <p>Email: ${contact.email}</p>
              </div>
              <div class="contact-actions">
                  <button class="edit-btn" data-id="${contact.id}">Edit</button>
                  <button class="delete-btn" data-id="${contact.id}">Delete</button>
              </div>
          `
      contactItems.appendChild(li)
    })
  
    // Add event listeners for edit and delete buttons
    document.querySelectorAll(".edit-btn").forEach((btn) => {
      btn.addEventListener("click", handleEdit)
    })
    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", handleDelete)
    })
  }
  
  async function handleFormSubmit(e) {
    e.preventDefault()
    const contact = {
      firstName: document.getElementById("firstName").value,
      lastName: document.getElementById("lastName").value,
      phone: document.getElementById("phone").value,
      email: document.getElementById("email").value,
    }
    if (editingContact) {
      await APIFUNCTIONS.updateContact(contact, editingContact.id)
      editingContact = null
      alert(`Contact updated: ${contact.firstName} ${contact.lastName}`)
    } else {
      await APIFUNCTIONS.addContact(contact)
      alert(`Contact added: ${contact.firstName} ${contact.lastName}`)
    }
  
    await loadContacts()
    resetForm()
  }
  
  function handleEdit(e) {
    const id = e.target.getAttribute("data-id")
    editingContact = contacts.find((contact) => contact.id === id)
    console.log("editingContact")
    console.log(editingContact)   
    if (editingContact) {
      document.getElementById("contactId").value = editingContact.id
      document.getElementById("firstName").value = editingContact.firstName
      document.getElementById("lastName").value = editingContact.lastName
      document.getElementById("phone").value = editingContact.phone
      document.getElementById("email").value = editingContact.email
      submitBtn.textContent = "Update Contact"
    }
    window.scrollTo(0, 0)
  }
  
  async function handleDelete(e) {
    const id = e.target.getAttribute("data-id")

    const contactToDelete = contacts.find((contact) => contact.id === id)
    if (contactToDelete) {
      if (confirm(`Are you sure you want to delete ${contactToDelete.firstName} ${contactToDelete.lastName}?`)) {
        await APIFUNCTIONS.deleteContact(id)
        alert(`Contact deleted: ${contactToDelete.firstName} ${contactToDelete.lastName}`)
        await loadContacts()
      }
    }
  }
  
  function resetForm() {
    contactForm.reset()
    document.getElementById("contactId").value = ""
    submitBtn.textContent = "Add Contact"
    editingContact = null
  }
  function handleSearch(e) {
    console.log("searching");
    const searchTerm = e.target.value.toLowerCase()
    const filteredContacts = contacts.filter(
      (contact) =>
        contact.firstName.toLowerCase().includes(searchTerm) ||
        contact.lastName.toLowerCase().includes(searchTerm) ||
        contact.phone.includes(searchTerm) ||
        contact.email.toLowerCase().includes(searchTerm),
    )
    console.log(filteredContacts);
    renderContacts(filteredContacts)
  }
  