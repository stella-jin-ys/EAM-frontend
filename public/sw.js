const key = new URL(location).searchParams.get('key');
const user = new URL(location).searchParams.get('user');

self.addEventListener("fetch", function (event) {
 // console.log("event:", event);
  event.respondWith(
    caches.open(event.request.url).then(function (cache) {
      //console.log("event.request.url:", event.request.url);
      return cache.match(event.request).then(function (response) {
        //console.log("online", navigator.onLine);
        if (navigator.onLine) {

          return fetch(event.request).then(function (response) {
            if (event.request.method == "GET") {
              cache.put(event.request, response.clone());
              // } else if  (event.request.method == "POST") {

              //   if (event.request.url.endsWith('grids/data/')) {
              //     cache.put(event.request, response.clone());
              //   }
            }

            return response;
          });
        } else {
          if (response) {
            return response;
          } else {
            return null;
          }
        }
      });
    })
  );
});

//const URL = "http://localhost:8080/api/";

self.addEventListener('sync', function (event) {
  console.log('sync event listener--:', event.tag + "vivek");
  console.log('network name:', navigator.connection);
  // const client = self.clients.get(event.clientId);
  // client.postMessage({
  //   msg: "Hey I just got a fetch from you!",
  //   //url: event.request.url
  // });

  //   Notification.requestPermission.then( self.registration.showNotification("vivek here"));


  if (event.tag == "workorder") {
    //we read total records first here to pass
    var indexedDBOpenRequest = indexedDB.open("workorder", 1);
    let totalCount;
    indexedDBOpenRequest.onsuccess = function () {
      let db = this.result;
      console.log("1111:", db);
      if (db.objectStoreNames.length > 0) {
        let transaction = db.transaction("workorder_requests", "readonly");

        let store = transaction.objectStore("workorder_requests");
        var count = store.count();
        console.log("count ", count);
        count.onsuccess = function () {
          console.log("count initial", count.result);
          totalCount = count.result;
          //event.waitUntil(saveWorkorderData(totalCount));
          saveWorkorderData(totalCount)
        }
      }
    }
    indexedDBOpenRequest.onerror = function (error) {
      console.error("IndexedDB workorder error:", error);
    };

  }
  if (event.tag == "check") {
    //first we check if connection to server is established like ESS VPN


    console.log('in checklist savce:');
    console.log('network name:', navigator.connection);
    var indexedDBOpenRequest = indexedDB.open("checklist", 1);
    let totalCount;
    indexedDBOpenRequest.onsuccess = function () {
      let db = this.result;
      if (db.objectStoreNames.length > 0) {
        let transaction = db.transaction("checklist_changes", "readonly");
        let store = transaction.objectStore("checklist_changes");
        var count = store.count();
        console.log("count ", count);
        count.onsuccess = function () {
          console.log("count initial", count.result);
          totalCount = count.result;
          //event.waitUntil(saveChecklistData());
          saveChecklistData(totalCount);
        }
      }
    }
    indexedDBOpenRequest.onerror = function (error) {
      console.error("IndexedDB checklist error:", error);
    };

  }
});

function saveWorkorderData(totalCount) {
  setTimeout(function () {
    console.log('Inside saveWorkorderData--33:', totalCount);

    var indexedDBOpenRequest = indexedDB.open("workorder", 1);


    indexedDBOpenRequest.onsuccess = function () {


      let db = this.result;
      //console.log('db--11:', db);
      let transaction = db.transaction("workorder_requests", "readwrite");
      let storeObj = transaction.objectStore("workorder_requests");

      let processedCount = 1;
      var cursorRequest = storeObj.openCursor();
      cursorRequest.onsuccess = function (evt) {
        var cursor = evt.target.result;
        //console.log('cursor--:', cursor);

        if (cursor) {
          //console.log("cursor.value", cursor.value);
          //console.log("cursor.value 1", cursor.value.number+ totalCount);
          saveWorkorder(cursor.value, cursor.key, totalCount, processedCount);
          processedCount++;
          cursor.continue();
          console.log('processedCount before--:', processedCount);

        }
      };
    };
    indexedDBOpenRequest.onerror = function (error) {
      console.error("IndexedDB error:", error);
    };
  }, 15000);
}
function saveChecklistData(totalCount) {
  setTimeout(function () {
    console.log('Inside saveChecklistData--44:');
    //we check if VPN is connected or network is established 
    // const online =  await checkOnlineStatus();
    // console.log("online  check:", online);
    // if (online) {


    var indexedDBOpenRequest = indexedDB.open("checklist", 1);
    indexedDBOpenRequest.onsuccess = function () {
      let db = this.result;
      console.log('db--22:', db);
      let processedCount = 1;
      let transaction = db.transaction("checklist_changes", "readwrite");
      let storeObj = transaction.objectStore("checklist_changes");
      console.log('storeObj--:', storeObj);
      var cursorRequest = storeObj.openCursor();
      cursorRequest.onsuccess = function (evt) {
        var cursor = evt.target.result;
        console.log('cursor--:', cursor);
        if (cursor != null) {
          console.log("cursor.value", cursor.value);
          console.log("cursor.key", cursor.key);
          saveChecklist(cursor.value, cursor.key, totalCount, processedCount);
          processedCount++;
          cursor.continue();
        }
      };
    };
    indexedDBOpenRequest.onerror = function (error) {
      console.error("IndexedDB error:", error);
    };
    //}
  }, 15000);
}

function deleteFromIndexdb(index) {
  var indexedDBOpenRequest = indexedDB.open("workorder", 1);
  indexedDBOpenRequest.onsuccess = function () {
    let db = this.result;
    let transaction = db.transaction("workorder_requests", "readwrite");
    let storeObj = transaction.objectStore("workorder_requests");
    storeObj.delete(index);
  };
}
function deleteFromIndexdbChecklist(index) {
  var indexedDBOpenRequest = indexedDB.open("checklist", 1);
  indexedDBOpenRequest.onsuccess = function () {
    let db = this.result;
    let transaction = db.transaction("checklist_changes", "readwrite");
    let storeObj = transaction.objectStore("checklist_changes");
    storeObj.delete(index);
  };
}

function saveWorkorder(data, index, initialCount, processedCount) {

  console.log("processedCount:", processedCount);
  // console.log("inforContextString:", inforContextString);
  //let jsonData = JSON.stringify(data)
  //let jsonData = JSON.parse(data)
  // console.log("jsonData-1122-", jsonData);
  // console.log("jsonData-1122-1", jsonData.number);
  //const instance = new Workorder(props);
  //instance.createEntity(data);

  let redirectURL = '';
  const requestOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      //'Host': 'localhost:8081',
      'INFOR_ORGANIZATION': 'ESS',
      'INFOR_PASSWORD': key,
      'INFOR_TENANT': 'DS_MP_1',
      //'INFOR_SESSIONID': '511b2867-1bac-4d64-a9ba-e02701a8866a',
      'INFOR_USER': user,
    },
    body: data,
    redirect: 'follow',
  };
  //console.log("requestOptions:",requestOptions);
  //fetch(process.env.REACT_APP_BACKEND+"/rest/workorders/"+jsonData.number, requestOptions).then((response) => {
  fetch("https://pim-eammobile02.esss.lu.se:8084/rest/workorders/", requestOptions).then((response) => {
    response.json().then(data => {
      console.log("data:", data);
      //console.log("error----",data.errors);
      //console.log("error----",data.errors.length);

      //error
      if (data.errors.length > 0) {
        console.log("erro has occured", data.errors[0].message);
        //failure message
        self.clients.matchAll().then(clients => {
          console.log("error in the call", processedCount);
          clients.forEach(client =>
            client.postMessage({
              msg: 'FailureKey:&' + index + '&&' + data.errors[0].message
            }));
        })
      } else {
        deleteFromIndexdb(index);
      }

      self.clients.matchAll().then(clients => {
        console.log("processedCount in the call", processedCount);
        clients.forEach(client =>
          client.postMessage({
            msg: 'SuccessKey: Processed: ' + processedCount + '/ ' + initialCount
          }));
      })

      //let number = data.data.number;
      //localStorage.setItem('offlinenumber',number);
      // console.log('number---',number);
      //redirectURL = '/workorder/'+number
      //console.log('redirectURL---',redirectURL);
      //self.window.history.pushState({}, 'Work Order' + ' ' + data,
      //'/workorder/' + encodeURIComponent(number));
      //window.location.href =  window.location.href+'/'+number


    });

    /*  console.log("response--2222response", response);
     console.log("response--3333", response.data);
     console.log("response--3333", response.body);
     console.log("response--2222 response.body.data[number]", number);
     if (response) {
      
     } */
  }).catch(err => {
    console.log("error in workorder fetching----", err + processedCount);
  });
}


function saveChecklist(data, index, initialCount, processedCount) {
  setTimeout(function () {
    console.log("data-2222-", data);
    console.log("processedCount-", processedCount);
    //let inforContextString = sessionStorage.getItem('inforContext')
    //console.log("inforContextString:", inforContextString);
    let jsonData = JSON.stringify(data)

    //const instance = new Workorder(props);
    //instance.createEntity(data);
    let redirectURL = '';
    const requestOptions = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        //'Host': 'localhost:8081',
        'INFOR_ORGANIZATION': 'ESS',
        'INFOR_PASSWORD': key,
        'INFOR_TENANT': 'DS_MP_1',
        //'INFOR_SESSIONID': '511b2867-1bac-4d64-a9ba-e02701a8866a',
        'INFOR_USER': user,
      },
      body: jsonData,
      redirect: 'follow',
    };
    console.log("requestOptions:", requestOptions);
    console.log("requestOptions checklist:", requestOptions.body);

    // make data request

    //fetch(process.env.REACT_APP_BACKEND+"/rest/checklists/", requestOptions).then((response) => {
    fetch("https://pim-eammobile02.esss.lu.se:8084/rest/checklists/", requestOptions).then((response) => {
      response.json().then(data => {
        //error
        if (data.errors.length > 0) {
          console.log("erro has occured", data.errors[0].message);
          //failure message
          self.clients.matchAll().then(clients => {
            console.log("error in the call", processedCount);
            clients.forEach(client =>
              client.postMessage({
                msg: 'FailureKey Checklist:&' + index + '&&' + data.errors[0].message
              }));
          })
        } else {
          deleteFromIndexdbChecklist(index);
        }

        self.clients.matchAll().then(clients => {
          console.log("processedCount in the call", processedCount);
          clients.forEach(client =>
            client.postMessage({
              msg: 'SuccessKey: Processed Checklist: ' + processedCount + '/ ' + initialCount
            }));
        })

      });

      /*  console.log("response--2222response", response);
       console.log("response--3333", response.data);
       console.log("response--3333", response.body);
       console.log("response--2222 response.body.data[number]", number);
       if (response) {
        
       } */
    }).catch(err => {
      console.log("err in fetching checklist----", err);
    });
  }, 1000);

//const checkOnlineStatus = async () => {
// async function checkOnlineStatus() {
//       try {
//         const response = await fetch("http://localhost:3000/rest/workorders/429222");
//         console.log("response status:", response.ok, response.json, response.status);
//         return response.status >= 200 && response.status < 300; // either true or false
//       } catch (err) {
//         return false; // definitely offline
//       }
//     }
  };
