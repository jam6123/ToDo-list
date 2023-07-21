const persons = [
    {
        name: 'jack',
        rich: false
    },
    {
        name: 'lesh',
        rich: false
    },{
        name: 'zoey',
        rich: false
    },
]
const student = persons

student[1].name = 'latest'
// student.find(student => student.name == 'lesh').rich = true

// console.log(student[2] == persons[2])
