const xmin = -50
const xmax = 50
const ymax = 30
const ymin = -10
const pl = planck
const Vec2 = pl.Vec2

const getRandomInRange = (min, max) => {
    return Math.random() * (max - min) + min;
}

const makePoints = (world, n) => {
    let points = []
    for (let i = 0; i < n; i++) {
        let x = getRandomInRange(xmin, xmax)
        let y = getRandomInRange(ymin, ymax)

        let point = world.createBody(Vec2(x, y))
        point.createFixture(pl.Circle(0.5), {
            filterGroupIndex: -1,
            density: 1,
        })

        points.push(point)
    }

    return points
}

const makeSprings = (world, points, rod) => {
    let springs = []

    points.forEach(point => {

        let bearing = world.createBody({
            type: 'dynamic',
            position: Vec2(0, 0)
        })

        bearing.createFixture(pl.Circle(0.01), {
            filterGroupIndex: -1
        })

        let joint = world.createJoint(pl.WheelJoint({
            bodyA: rod,
            bodyB: bearing,
            localAxisA: Vec2(1, 0),
        }))

        let vertjoint = world.createJoint(pl.PrismaticJoint({
            bodyA: point,
            bodyB: bearing,
            localAxisA: Vec2(0, 1)
        }))

        let vertspring = world.createJoint(pl.DistanceJoint({
            bodyA: point,
            bodyB: bearing,
            localAnchorA: Vec2(0, 0),
            localAnchorB: Vec2(0, 0),
            frequencyHz: 2,
            dampingRatio: 0.9,
            length: 0
        }))

        springs.push([bearing, joint, vertjoint, vertspring])
    })

    return springs
}

const makeRod = (world) => {
    let rod = world.createBody({
        type: 'dynamic',
        fixedRotation: false,
    })
    rod.createFixture(pl.Box(xmax*1.5, 0.2), {
        friction: 0,
        density: 1,
        filterGroupIndex: -1,
    })

    return rod
}

const makeGrid = world => {
    let xaxis = world.createBody(Vec2(0, 0))
    xaxis.createFixture(pl.Box(xmax*1.5, 0.1), {
        filterGroupIndex: -1
    })

    let yaxis = world.createBody(Vec2(0, 0))
    yaxis.createFixture(pl.Box(0.1, ymax*1.5), {
        filterGroupIndex: -1
    })

    return [xaxis, yaxis]
}


document.addEventListener("DOMContentLoaded", event => {
    let statusbox = document.getElementById('status')
    pl.testbed(testbed => {
        let gravity = Vec2(0, 0);
        let world = pl.World(gravity);
        let grid = makeGrid(world)
        let points = makePoints(world, 5)
        let rod = makeRod(world)
        let springs = makeSprings(world, points, rod)

        /*
        testbed.step = () => {
            statusbox.innerText = `Angle (radians): ${rod.getAngle()}`
        }
        */

        return world;
    })
})
