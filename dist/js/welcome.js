
fetch('/manifest.json')
  .then(r => r.json())
  .then(o => {
    document.getElementById('version').innerHTML = 'v' + o['version']
  });
