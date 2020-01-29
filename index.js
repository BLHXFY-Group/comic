const glob = require('glob')
const path = require('path')
const fs = require('fs-extra')

const Glob = glob.Glob
glob.promise = function (pattern, options) {
  return new Promise(function (resolve, reject) {
    var g = new Glob(pattern, options)
    g.once('end', resolve)
    g.once('error', reject)
  })
}

const cleanDist = () => fs.emptyDir('./dist/')
const moveComic = async () => {
  const pics = await glob.promise('./**/*.jpg')
  let data = new Map()
  for (let pic of pics) {
    let name = path.basename(pic, '.jpg')
    let rgs = name.match(/^(\d+)([-—－](.+))?/)
    if (!rgs) {
      return
    }
    let id = rgs[1]
    let ename = rgs[3]
    data.set(id, ename || '')
    await fs.copy(pic, `./dist/4ko/${id}.jpg`)
  }
  await fs.outputJSON('./dist/4ko.json', [...data])
}

const start = async () => {
  await cleanDist()
  await fs.ensureDir('./dist/4ko/')
  await moveComic()
  fs.outputFile('./dist/CNAME', 'gbf.danmu9.com')
}

start()