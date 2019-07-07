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
      M[i][j] = M[i-1][j-1] + 1
    } else {
      M[i][j] = Math.max(M[i-1][j], M[i][j-1])
    }
  }
}

console.log('--- MATRIX ---')
M.forEach(r => {
  r.forEach(c => process.stdout.write(c + '\t'))
  process.stdout.write('\n')
})

// -----------------------------------------------------------------------------

console.log('--- DIFF ALGORITHM ---')

let i = b.length
let j = a.length

// left then up
// -1 means left, 0 means diag, 1 means up
const backPath = []
while (i > 0 || j > 0) {
  if (j > 0 && M[i][j-1] === M[i][j]) {
    console.log(`${M[i][j-1]} === ${M[i][j]}`)
    backPath.push(-1)
    j--
    console.log(`so we go left and proceed (${i},${j})`)
    continue
  }
  console.log(`We shall go up until we hit a corner (${i},${j})`)
  while (i > 0 && M[i-1][j] === M[i][j]) {
    backPath.push(1)
    i--
    console.log(`Up! (${i},${j})`)
  }
  if (i > 0 && j > 0) {
    backPath.push(0)
    i--
    j--
    console.log(`We're taking the bridge (${i},${j})`)
  }
}

const path = backPath.reverse()

// -----------------------------------------------------------------------------

const actions = []
let p = path[0]
let ai = 0
i = 0, j = 0
let sum = 0

while (ai < path.length) {
  p = path[ai]
  while (path[ai] === p) {
    sum++
    ai++
  }
  if (p === -1) {
    actions.push({
      type: 'remove',
      start: i,
      length: sum,
    })
  } else if (p === 0) {
    i += sum
    j += sum
  } else {
    actions.push({
      type: 'add',
      start: i,
      content: b.split('').slice(j, j + sum).join('')
    })
    i += sum
    j += sum
  }
  sum = 0
}

console.log('--- INSTRUCTIONS ---')
console.log('actions', actions)

// -----------------------------------------------------------------------------

console.log('--- EXECUTION ---')

let s = a.split('')
console.log(s.join(''))

actions.forEach(({ type, start, content, length }) => {
  if (type === 'add') {
    s.splice(start, 0, ...content)
  } else {
    s.splice(start, length)
  }
  console.log(s.join(''))
})
