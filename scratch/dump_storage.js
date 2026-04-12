
const published = localStorage.getItem('published_timetables');
if (published) {
    const data = JSON.parse(published);
    const firstSection = Object.keys(data)[0];
    const sectionData = data[firstSection];
    const grid = sectionData.grid || sectionData;
    const firstSessionKey = Object.keys(grid)[0];
    console.log('Sample Session Structure:', grid[firstSessionKey]);
} else {
    console.log('No published timetables found in localStorage');
}
