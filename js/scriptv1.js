const input = document.getElementById('fileInput');
const dataList = document.getElementById('dataList');
const loader = document.querySelector('.lds-facebook');
const searchBox = document.querySelector('.container__searchbox');
const searchInput = document.getElementById('searchInput');
let originalItems = [];
let lineNumber = 1;

input.addEventListener('change', () => {
  //Clear the search box if new file is uploaded
  searchInput.value = '';

  //if file doesn't exist
  if (!input.files.length) {
    console.log('Please select a file to upload');
    return;
  }

  //if file is not a .txt file
  if (!input.files[0].type.match('text/plain')) {
    alert('Please upload a .txt file');
    return;
  }

  //show Searchbox
  searchBox.classList.remove('hidden');

  // Show the loader
  loader.classList.remove('hidden');
  dataList.classList.add('hidden');

  const reader = new FileReader();

  // Start reading the file
  reader.readAsText(input.files[0]);

  reader.onload = () => {
    const lines = reader.result.split('\n');
    let currentLine = 0;

    // Function that processes lines in batches
    const processLines = () => {
      let linesProcessed = 0;
      const batchSize = 10000;
      while (linesProcessed < batchSize && currentLine < lines.length) {
        const line = lines[currentLine];
        const values = line.split(',');
        const firstName = values[0];
        const lastName = values[1];
        const street = values[2];
        const city = values[3];
        const postCode = values[4];
        const eMail = values[5];
        const telephone = values[6];
        const li = document.createElement('li');
        li.innerText = `${lineNumber}) ${firstName} ${lastName} | ${street}, ${city}, ${postCode} | ${eMail} | ${telephone}`;
        dataList.appendChild(li);
        currentLine++;
        linesProcessed++;
        lineNumber++;
      }

      // Check if all lines have been processed
      if (currentLine < lines.length) {
        setTimeout(processLines, 0);
      } else {
        // Hide the loader and show the data list
        setTimeout(() => {
          loader.classList.add('hidden');
          dataList.classList.remove('hidden');
        }, 3000);
        originalItems = [...dataList.children];
      }
    };

    // Start processing the lines
    processLines();
  };
});

// Search functionality
searchInput.addEventListener('input', (event) => {
  //check if search input is empty
  if (!event.target.value) {
    //clear datalist
    dataList.innerHTML = '';
    originalItems.forEach((item) => dataList.appendChild(item));
    lineNumber = 1;
    return;
  }
  const searchTerm = event.target.value.toLowerCase();
  const filteredItems = [...originalItems].filter((li) => {
    const text = li.innerText.toLowerCase();
    const values = text.split('|');
    const nameSurname = values[0].trim().toLowerCase();
    const streetCity = values[1].trim().toLowerCase();
    //check if name or surname includes search term
    return nameSurname.includes(searchTerm) || streetCity.includes(searchTerm);
  });
  //Clear out the datalist so we can add the filtered items
  dataList.innerHTML = '';
  currentLineNumber = 1;
  if (filteredItems.length > 0) {
    filteredItems.forEach((li) => {
      li.innerText = `${currentLineNumber}) ${li.innerText.split(')')[1]}`;
      dataList.appendChild(li);
      currentLineNumber++;
    });
  } else {
    const noResults = document.createElement('li');
    noResults.innerText = 'No data found';
    dataList.appendChild(noResults);
  }
});
