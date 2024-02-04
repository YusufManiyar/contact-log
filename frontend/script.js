try {
const openFormBtn = document.getElementById('openFormBtn');
const closeFormBtn = document.getElementById('closeFormBtn');
const updateCloseFormBtn = document.getElementById('updateCloseFormBtn');
const contactFormContainer = document.getElementById('contactFormContainer');
const form = document.getElementById('contactForm');
const ul = document.getElementById('showAppoinments');

const fetchAllData = async () => {
  try {
    const response = await fetch('http://localhost:4000/appointment'); // Replace with your actual API endpoint

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching data:', error.message);
    // Handle errors during the fetch process
  }
};

// Function to render appointments
var renderAppointments = async () => {
  const appointments = await fetchAllData()
  const appointmentList = document.getElementById('showAppoinments');
  appointmentList.innerHTML = '';

  appointments.forEach(appointment => {
    const listItem = document.createElement('li');
    listItem.id = appointment.id;
    [appointment.date, appointment.time] = moment.utc(appointment.scheduledAt).local().format('YYYY-MM-DD HH:mm').split(' ')
    listItem.innerHTML = `
      <strong>${appointment.name} ${appointment.mobile} ${appointment.email} ${appointment.date} ${appointment.time}</strong>
      <button onclick="updateAppointment(${appointment.id}, '${appointment.name}', '${appointment.mobile}', '${appointment.email}', '${appointment.date}', '${appointment.time}')">Update Booking</button>
      <button onclick="cancelAppointment(${appointment.id})">Cancel Booking</button>
    `;
    // listItem.className="cancel"
    if(appointment.isCancelled){
      listItem.style.backgroundColor = 'red';
    }
    appointmentList.appendChild(listItem);
  });
};

// Example usage
renderAppointments();

function updateAppointment(id, name, mobile, email, date, time) {
  const updateForm = document.getElementById('updateForm');
  const nameInput = document.getElementById('updateName');
  const mobileInput = document.getElementById('updateMobile');
  const emailInput = document.getElementById('updateEmail');
  const dateInput = document.getElementById('updateDate');
  const timeInput = document.getElementById('updateTime');

  // Set initial values in the form
  nameInput.value = name;
  mobileInput.value = mobile;
  emailInput.value = email;
  dateInput.value = date;
  timeInput.value = time;

  // Display the modal
  document.getElementById('updateModal').style.display = 'block';

  // Handle form submission
  updateForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const updatedName = nameInput.value;
    const updatedMobile = mobileInput.value;
    const updatedEmail = emailInput.value;
    const updatedDate = dateInput.value;
    const updatedTime = timeInput.value;

    // Handle date and time updates based on your requirements

    // Create an object with the updated data
    const updatedData = {
      id: id,
      name: updatedName,
      mobile: updatedMobile,
      email: updatedEmail,
      date: updatedDate,
      time: updatedTime
      // Add date and time properties if you allow editing them
    };

    // Send the updated data to the backend
    try {
      await fetch(`http://localhost:4000/appointment`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      })
      .then(resp => resp.json())
      .then(data => {
        var [ date, time] = moment.utc(data.scheduledAt).local().format('YYYY-MM-DD HH:mm').split(' ')
        const listItem = document.getElementById(data.id);
        // listItem.id=id
        // listItem.className="cancel"
        listItem.innerHTML = `
        <strong>${data.name} ${data.mobile} ${data.email} ${date} ${time}</strong>
        <button onclick="updateAppointment(${data.id}, '${data.name}', '${data.mobile}', '${data.email}', '${data.date}', '${data.time}')">Update Booking</button>
        <button onclick="cancelAppointment(${data.id})">Cancel Booking</button>
      `;
            // ul.appendChild(listItem);
      })

      // if (!response.ok) {
      //   throw new Error(`HTTP error! Status: ${response.status}`);
      // }

      // Handle the success case, e.g., update the UI or reload the data
      console.log('Appointment updated successfully');

      // Hide the modal after successful update
      document.getElementById('updateModal').style.display = 'none';
    } catch (error) {
      console.error('Error updating appointment:', error.message);
      // Handle errors during the update process
    }
  });

  updateCloseFormBtn.addEventListener('click', function () {
    updateModal.style.display = 'none';
  });
  
};

const scheduleAppointemntAndDisplay = async (e) => {
  e.preventDefault()

    let appointment = {
      name: e.target.name.value,
      mobile: e.target.mobile.value,
      email: e.target.email.value,
      date: e.target.date.value,
      time: e.target.time.value
    }

    const response = await fetch('http://localhost:4000/appointment', {method: 'POST', headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(appointment),
  })
  const { id, name, mobile, email, scheduledAt } = await response.json()

  let [date, time] = moment.utc(scheduledAt).local().format('YYYY-MM-DD HH:mm').split(' ')
  const listItem = document.createElement('li');
  listItem.id=id
  listItem.className="cancel"
  listItem.innerHTML = `
  <strong>${name} ${mobile} ${email} ${date} ${time}</strong>
  <button onclick="updateAppointment(${id}, '${name}', '${mobile}', '${email}', '${date}', '${time}')">Update Booking</button>
  <button onclick="cancelAppointment(${id})">Cancel Booking</button>
`;
      ul.appendChild(listItem);

      document.getElementById('contactFormContainer').style.display = 'none';
    }

form.addEventListener('submit', scheduleAppointemntAndDisplay)

openFormBtn.addEventListener('click', function () {
  contactFormContainer.style.display = 'block';
});

closeFormBtn.addEventListener('click', function () {
  contactFormContainer.style.display = 'none';
});

// Close the form if the user clicks outside of it
window.addEventListener('click', function (event) {
  if (event.target === contactFormContainer) {
    contactFormContainer.style.display = 'none';
  }
});

}
catch(error) {
  console.log(error)
}


const cancelAppointment = async (id) => {
  try {
    const response = await fetch(`http://localhost:4000/appointment`,  {method: 'DELETE', headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({id}),
  });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    console.log('Appointment deleted successfully');

    // Refresh the list after deletion
    renderAppointments();

  } catch (error) {
    console.error('Error deleting appointment:', error.message);
    // Handle errors during the delete process
  }
};