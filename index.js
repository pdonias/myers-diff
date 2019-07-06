const [,, a, b] = process.argv

// a: foobar
// b: baz

//     f o o b a r
//   . . . . . . .
// b . . . . . . .
// a . . . . . . .
// z . . . . . . .

const M = new Array(b.length + 1)
for (let i = 0; i < M.length; i++) {
  M[i] = new Array(a.length + 1)
}

for (let i = 0; i < b.length + 1; i++) {
  for (let j = 0; j < a.length + 1; j++) {
    if (i === 0 || j === 0) {
      M[i][j] = 0
    } else if (a[j-1] === b[i-1]) {
      // console.log(`a[j]=${a[j]} and b[i]=${b[i]}`)
      M[i][j] = M[i-1][j-1] + 1
    } else {
      M[i][j] = Math.max(M[i-1][j], M[i][j-1])
    }
  }
}

M.forEach(r => console.log(r))

let i = b.length
let j = a.length
let lastAction

// left then up
// -1 means left, 0 means diag, 1 means up
const backPath = []
const backActions = []
while (i > 0 || j > 0) {
  if (j > 0 && M[i][j-1] === M[i][j]) {
    console.log(`${M[i][j-1]} === ${M[i][j]}`)
    backPath.push(-1)
    if (lastAction === 'remove') {
      backActions[backActions.length - 1].length++
    } else {
      backActions.push({
        type: 'remove',
        start: i,
        length: 1,
      })
    }
    lastAction = 'remove'
    j--
    console.log(`so we go left and proceed (${i},${j})`)
    continue
  }
  console.log(`We shall go up until we hit a corner (${i},${j})`)
  while (i > 0 && M[i-1][j] === M[i][j]) {
    backPath.push(1)
    if (lastAction === 'add') {
      backActions[backActions.length - 1].content = b[i-1] + backActions[backActions.length - 1].content
    } else {
      backActions.push({
        type: 'add',
        start: j,
        content: b[i-1]
      })
    }
    lastAction = 'add'
    i--
    console.log(`Up! (${i},${j})`)
  }
  if (i > 0 && j > 0) {
    backPath.push(0)
    lastAction = undefined
    i--
    j--
    console.log(`We're taking the bridge (${i},${j})`)
  }
}

const path = backPath.reverse()
const actions = backActions.reverse()

console.log(path)
console.log(actions)

let s = a.split('')
console.log('Process')
console.log(s.join(''))

// i = 0
// j = 0
// path.forEach(d => {
//   if (d === -1) {
//     s.splice(i, 1)
//     console.log(s.join(''))
//   } else if (d === 0) {
//     i++
//     j++
//   } else if (d === 1) {
//     s.splice(i, 0, b[j])
//     i++
//     j++
//     console.log(s.join(''))
//   }
// })

actions.forEach(a => {
  if (a.type === 'add') {
    s.splice(a.start, 0, ...a.content)
  } else {
    s.splice(a.start, a.length)
  }
  console.log(s.join(''))
})

s = s.join('')
