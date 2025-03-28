$(document).ready(function() {
  $('.select2').select2({
    placeholder: "Select Country Code",
    allowClear: true
  });
});

document.getElementById('contact-form').addEventListener('submit', function(event) {
  event.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const countryCode = document.getElementById('country-code').value;
  const phone = document.getElementById('phone').value;

  if (!validateEmail(email)) {
    alert('Please enter a valid email address.');
    return;
  }

  if (!validatePhone(phone)) {
    alert('Please enter a valid 10-digit phone number.');
    return;
  }

  createContact(name, email, countryCode, phone);
});

const createContact = (name, email, countryCode, phone) => {
  fetch('http://localhost:5000/contacts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, email, country_code: countryCode, phone })
  })
  .then(response => response.json())
  .then(data => {
    if (data.error) {
      console.error('Error:', data.error);
      alert('Error: ' + data.error);
    } else {
      console.log('Contact created:', data);
      fetchContacts();
    }
  })
  .catch(error => console.error('Error:', error));
};

const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

const validatePhone = (phone) => {
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(phone);
};

const fetchContacts = () => {
  fetch('http://localhost:5000/contacts')
    .then(response => response.json())
    .then(data => {
      const contactsList = document.getElementById('contacts-list');
      contactsList.innerHTML = ''; // Clear existing content
      data.forEach(contact => {
        const div = document.createElement('div');
        div.className = 'contact';
        div.innerHTML = `
          <div>${contact.name}</div>
          <div>${contact.email}</div>
          <div>${contact.country_code} ${contact.phone}</div>
          <button class="edit-button" onclick="openEditModal(${contact.id}, '${contact.name}', '${contact.email}', '${contact.country_code}', '${contact.phone}')">Edit</button>
          <button class="delete-button" onclick="deleteContact(${contact.id})">Delete</button>
        `;
        contactsList.appendChild(div);
      });
    })
    .catch(error => console.error('Error:', error));
};

const updateContact = (id, name, email, countryCode, phone) => {
  fetch(`http://localhost:5000/contacts/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, email, country_code: countryCode, phone })
  })
  .then(response => response.json())
  .then(data => {
    if (data.error) {
      console.error('Error:', data.error);
      alert('Error: ' + data.error);
    } else {
      console.log('Contact updated:', data);
      fetchContacts();
      closeEditModal();
    }
  })
  .catch(error => console.error('Error:', error));
};

const deleteContact = (id) => {
  fetch(`http://localhost:5000/contacts/${id}`, {
    method: 'DELETE'
  })
  .then(response => response.json())
  .then(data => {
    if (data.error) {
      console.error('Error:', data.error);
      alert('Error: ' + data.error);
    } else {
      console.log('Contact deleted:', data);
      fetchContacts();
    }
  })
  .catch(error => console.error('Error:', error));
};

const openEditModal = (id, name, email, countryCode, phone) => {
  document.getElementById('edit-id').value = id;
  document.getElementById('edit-name').value = name;
  document.getElementById('edit-email').value = email;
  document.getElementById('edit-country-code').value = countryCode;
  document.getElementById('edit-phone').value = phone;
  document.getElementById('edit-modal').style.display = 'block';
};

const closeEditModal = () => {
  document.getElementById('edit-modal').style.display = 'none';
};

// Initial fetch to display contacts
fetchContacts();