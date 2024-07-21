document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('addressForm');
  const outputDiv = document.getElementById('output');

  if (!form || !outputDiv) {
    console.error('Form or outputDiv not found');
    return;
  }

  form.addEventListener('submit', async function(event) {
    event.preventDefault();

    // Get Input Values
    const street = document.getElementById('street').value;
    const city = document.getElementById('city').value;
    const state = document.getElementById('state').value;
    const zip = document.getElementById('zip').value;

    // Retrieve the token from Chrome storage
    chrome.storage.sync.get('accessToken', async (data) => {
      if (chrome.runtime.lastError) {
        console.error('Error retrieving token:', chrome.runtime.lastError);
        outputDiv.textContent = 'Failed to retrieve access token. Please try again later.';
        return;
      }

      const accessToken = data.accessToken;
      if (!accessToken) {
        console.error('Access token is undefined');
        outputDiv.textContent = 'Access token is not available. Please check your configuration.';
        return;
      }

      // Your API Call Logic
      const apiUrl = 'https://api.precisely.com/911/v1/psap/byaddress';
      const encodedAddress = encodeURIComponent(`${street} ${city} ${state} ${zip}`);

      const headers = {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      };

      try {
        const response = await fetch(`${apiUrl}?address=${encodedAddress}`, { headers });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        const { agency, phone } = data;

        // Update UI with API response
        outputDiv.textContent = `Agency: ${agency}, Phone: ${phone}`;
      } catch (apiError) {
        console.error('Error making API call:', apiError.message);
        outputDiv.textContent = 'Failed to retrieve data. Please try again later.';
      }
    });
  });
});