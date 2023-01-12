const input = document.getElementById('fileInput');
const dataList = document.getElementById('dataList');
const loader = document.querySelector('.lds-facebook');
const searchBox = document.querySelector('.container__searchbox');
const searchInput = document.getElementById('searchInput');
let originalItems = [];
let lineNumber = 1;
let offset = 0;
let line = '';
let file;
const chunkSize = 8 * 1024; // change to smaller chunks
let totalLines = 0;
let filteredItems = [];
let isEndOfFile = false;
let searchTerm = '';

//Uploading and reading the file in chunks
input.addEventListener('change', async () => {
  // Clear the search box if new file is uploaded
  searchInput.value = '';
  dataList.innerHTML = '';
  lineNumber = 1;

  // Error handling for no file selected or invalid file type
  if (!input.files.length) {
    console.log('Please select a file to upload');
    return;
  }
  if (!input.files[0].type.match('text/plain')) {
    alert('Please upload a .txt file');
    return;
  }

  // Show the search box
  searchBox.classList.remove('hidden');

  // Show the loader
  loader.classList.remove('hidden');

  file = input.files[0];
  await handleChunk();
  setTimeout(() => {
    loader.classList.add('hidden');
    dataList.classList.remove('hidden');
  }, 3000);

  dataList.addEventListener('scroll', async () => {
    if (
      dataList.scrollTop + dataList.clientHeight >= dataList.scrollHeight &&
      originalItems.length < totalLines
    ) {
      await handleChunk();
    }
  });

  //Function to handle chunks and display data
  async function handleChunk() {
    if (isEndOfFile) {
      return;
    }

    const fileReader = new FileReader();
    fileReader.onload = async () => {
      const chunk = fileReader.result;
      const lines = chunk.split('\n');
      lines[0] = line + lines[0];
      line = lines.pop();
      totalLines += lines.length - 1;
      lines.forEach((fileLine) => {
        const values = fileLine.split(',');
        const firstName = values[0];
        const lastName = values[1];
        const street = values[2];
        const city = values[3];
        const postCode = values[4];
        const eMail = values[5];
        const telephone = values[6];

        //Create a new li element
        const li = document.createElement('li');
        //Add line number to the li text
        li.innerText = `${lineNumber}) ${firstName} ${lastName} | ${street}, ${city}, ${postCode} | ${eMail} | ${telephone}`;
        //Append the new li element to the dataList
        dataList.appendChild(li);
        lineNumber++;
      });

      //update the offset and originalItems
      offset += chunkSize;
      originalItems = [...dataList.children];
      //Check if we've reached the end of the file
      if (offset >= file.size || totalLines >= file.size) {
        // If we've reached the end of the file, set isEndOfFile to true
        isEndOfFile = true;
      } else {
        // Otherwise, continue to load more data
        fileReader.readAsText(file.slice(offset, offset + chunkSize));
      }
    };
    fileReader.readAsText(file.slice(offset, offset + chunkSize));
  }
});
