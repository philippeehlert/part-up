Partup.client.sort = {
  // Sorts an array alphabetically in ascending order
  // use any key you like:
  // Partup.client.sort.alphabeticallyASC.bind(null, 'name')
  alphabeticallyASC: function(key, a, b) {
    let nameA = a[key].toUpperCase();
    let nameB = b[key].toUpperCase();
    return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
  },

  // Sorts an array alphabetically in descending order
  // use any key you like:
  // Partup.client.sort.alphabeticallyDESC.bind(null, 'name')
  alphabeticallyDESC: function(key, a, b) {
    let nameA = a[key].toUpperCase();
    let nameB = b[key].toUpperCase();
    return nameA < nameB ? 1 : nameA > nameB ? -1 : 0;
  },

  // Sorts an array by date in ascending order
  // use any key you like:
  // Partup.client.sort.dateASC.bind(null, 'created_at')
  dateASC: function(key, a, b) {
    let dateA = a[key];
    let dateB = b[key];

    // Make sure undefined dates are not interpreted as date
    if (!dateA && !dateB) return 0;
    if (dateA && !dateB) return -1;
    if (!dateA && dateB) return 1;

    return dateA < dateB ? -1 : dateA > dateB ? 1 : 0;
  },

  // Sorts an array by date in descending order
  // use any key you like:
  // Partup.client.sort.dateDESC.bind(null, 'created_at')
  dateDESC: function(key, a, b) {
    let dateA = a[key];
    let dateB = b[key];

    // Make sure undefined dates are not interpreted as date
    if (!dateA && !dateB) return 0;
    if (dateA && !dateB) return 1;
    if (!dateA && dateB) return -1;

    return dateA < dateB ? 1 : dateA > dateB ? -1 : 0;
  },
};
