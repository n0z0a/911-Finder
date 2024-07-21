chrome.runtime.onInstalled.addListener(() => {
   const accessToken = 'TuAgnOOsnHbtNAAlflsrJoGmmPAk';
   chrome.storage.sync.set({ accessToken }, () => {
     console.log('Access token is set.');
   });
 });