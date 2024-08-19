// import fetch from 'node-fetch';
// import { exec } from 'child_process';

// // Import lists
// const url_List = require('./url_List'); // List of all URLs
// const narrowerList = require('./narrowerList'); // Narrower list of URLs

// // Function to check URLs
// const checkUrls = async () => {
//   let needsRestart = false;

//   for (const url of url_List) {
//     try {
//       const response = await fetch(url, { timeout: 5000 }); // Set a timeout of 5 seconds
//       if (narrowerList.includes(url)) {
//         if (response.status === 400) {
//           console.log(`URL: ${url} - Error 400 Detected`);
//           needsRestart = true;
//         } else {
//           console.log(`URL: ${url} - Status Code: ${response.status}`);
//         }
//       } else {
//         console.log(`URL: ${url} - Not in narrower list`);
//       }
//     } catch (error) {
//       if (error.code === 'ECONNABORTED') {
//         console.log(`URL: ${url} - Timeout Error`);
//         if (narrowerList.includes(url)) {
//           needsRestart = true;
//         }
//       } else {
//         console.log(`URL: ${url} - Error: ${error.message}`);
//       }
//     }
//   }

//   if (needsRestart) {
//     // Restart Apache server
//     exec('sudo systemctl restart apache2', (error, stdout, stderr) => {
//       if (error) {
//         console.error(`Error restarting Apache: ${error.message}`);
//         return;
//       }
//       if (stderr) {
//         console.error(`Apache restart stderr: ${stderr}`);
//         return;
//       }
//       console.log(`Apache restarted successfully: ${stdout}`);
//     });
//   }
// };

// checkUrls();

import { NodeSSH } from 'node-ssh';
import fetch from 'node-fetch';
import { exec } from 'child_process';

const ssh = new NodeSSH();

const serverConfig = {
  host: 'server_ip',
  username: 'your_username',
  privateKey: 'path/to/your/privateKey' // Use private key for authentication
};

const url_List = require('./url_List'); // List of all URLs
const narrowerList = require('./narrowerList'); // Narrower list of URLs

const checkUrls = async () => {
  let needsRestart = false;

  for (const url of url_List) {
    try {
      const response = await fetch(url, { timeout: 5000 }); // Set a timeout of 5 seconds
      if (narrowerList.includes(url)) {
        if (response.status === 400) {
          console.log(`URL: ${url} - Error 400 Detected`);
          needsRestart = true;
        } else {
          console.log(`URL: ${url} - Status Code: ${response.status}`);
        }
      } else {
        console.log(`URL: ${url} - Not in narrower list`);
      }
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        console.log(`URL: ${url} - Timeout Error`);
        if (narrowerList.includes(url)) {
          needsRestart = true;
        }
      } else {
        console.log(`URL: ${url} - Error: ${error.message}`);
      }
    }
  }

  if (needsRestart) {
    console.log('Restarting Apache server on remote server...');
    await ssh.connect(serverConfig);
    await ssh.execCommand('sudo systemctl restart apache2');
    console.log('Apache restarted successfully on remote server.');
  }
};

checkUrls();

