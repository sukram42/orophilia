import { assign, createMachine, fromPromise, setup } from "xstate";


interface Point {
    lat: number
    lon: number
}
interface Tour {
    start: Point,
    destination: Point,
    points: Point[]
}

function getShortestPath(data: Tour) {
    console.log("data", data)
    return fetch("http://localhost:8000/waypoints", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        },
    }).then(res => res.json())
}


const resetStartStep = {
    target: "setStart",
    actions: assign({
        start: ({ context, event }) => {
            context.start = null
            context.waypoints = []
        }
    })
}


export const planningMachine = setup({
    actors: {
        getShortestPath: fromPromise(async ({ input }) => {
            return getShortestPath(input as Tour)
        })
    }
}).createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5QAcA2BDAdpglpqAsugMYAWeYAdLAC7oBONAxAHICiA6gNoAMAuohQB7WDho4hmQSAAeiAIwA2HpUVrFATgBMAZh0b5PLQFYAHABoQATwU8ALJXkB2HvJ13Fpu0-laNAX39LNCxcfCIyCmo6RiYAETYAZQAVAEkWAEE0gHkWAH0AcVSANTYWXgEkEGQRMQkpKrkEJRV1TV19QxMLa0QtLQdNJw07Ea8XRSdTQOCMbDxCEnJMKlgwGji4cUx0cUl4pLTMnPzEtmSK6RrRPYbQJuNPSh5FXU8vHWHjDUsbBFN5JQdKZTBoePZ9O4nDpjDNqnMwotIitqOtEjFmCkMgAlZJ5M4XfhXWq3aRNDQgyhORQ6TQ8YzyDQaam-PoDVTMjQ6HjaV5aIx2OEhebhJZRdAQCAcdBWGp4GiwJgZOJxPIcDIATQACtl0slEpcqtc6pIyYhHqZnq9aSC7J8NN9WQhFMZBgMKcYtJpTC7FEKEQsIssqBKpTK5ZgFfFcmxDcIbvUzQgLVa3rb7Y7eggDJaPM4lMZXcp6f7QoGxSjQ9LZUJ5YrlXF1drdSx9QAhDIAYQA0nHqiTE41zU8XmmPl8flnhk5KFz9MzGaYTIzSyKkcHKFXw7XI4rsUlzvjkjjCZV4ya7rJh5bRzbxw7J38bc8XhpFPI7G4eTp5KvEUGogAV2QCBdjAasI2YCBJCoPAADchAAayoYV-wrKhgNAmhwO3eUEHgoRiF2eoKj7Y1SSHbNKWpWkwQZJkWSzBktEoAFvmUG1+hpP9y2RENJQgncFTbEhEOjdgyIHU1KIpS0aLpejmUUJ1p1nPQGMXZcAiCeEy1FPjKGuGhkHoQi4EVOIY0khNpPuBQ7RY+RDFMJwtBBSYzDsJ1THpRxTH0MxGWGMFtJ0zAhAgOArgDfTg2JGzLyaABaZSsxSnjYqiWgGBoeKLyTOwtCdJyVB9Oxvhcngl2McEnAy9csvWTZaDwYjbP7BKk0+GclxpH9PR0XQ7GG4r7EoYbhkG75eVGbTZj0hqUTWGh0RyvKKLs-5fEoBlPmBeQ2MLJwnQGGcnEeN9uR9Nwph0eqAMrATcN3dbB02z4HAdJcYVcHzTELHQnTsMboS9YHHjMLRqUFHTUN4jdMLAwT5Ve9qmicplKH5HzsZcbQeEBpjDDU+ktA-dwi2he70M3J6azrETiEQ1HEsQYZPv+rljBhAwBpUiksac861BcfoPGpgyjJMszYHgI0pNZ5ouNnbQfB5IwuRebzfLzYWnJMO1f1hmLFqoaCVhZpN5G5md9tGVylHtHo-h8hwyecCruc8alAkCIA */
    id: 'planningMachine',
    initial: 'start',
    context: {
        start: null,
        end: null,
        points: [],
        waypoints: []
    },
    states: {
        start: {
            on: {
                NEW: "setDestination",
                DESTINATION_GIVEN: {
                    target: "setStart",
                    actions: assign({
                        destination: ({ event }) => event.point
                    })
                }
            }
        },

        setDestination: {
            on: {
                DESTINATION_SET: {
                    target: "setStart",
                    actions: assign({
                        destination: ({ event }) => event.point
                    })
                }
            }
        },

        setStart: {
            on: {
                START_SET: {
                    target: "updateWaypoint",
                    actions: assign({
                        start: ({ event }) => event.point
                    })
                }
            }
        },

        addWaypoints: {
            on: {
                ADD_WAYPOINTS: {
                    target: "updateWaypoint",
                    actions:
                        assign({
                            points: ({ context, event }) => {
                                return [...context.points, event.point]
                            }
                        })
                },
                DONE: "postprocess",
                ADDWAYPOINTSBACK: "addWaypointsBack",
                RESET_START: resetStartStep
            }
        },

        updateWaypoint: {
            invoke: {
                input: ({ context }) => ({
                    start: context.start,
                    destination: context.destination,
                    points: context.points
                }),
                src: "getShortestPath",
                onDone: {
                    target: "addWaypoints",
                    actions: assign({
                        waypoints: ({ event }) => event.output
                    })
                }
            }
        },

        addWaypointsBack: {
            on: {
                DONE: "postprocess",
            }
        },

        postprocess: {
            on: {
                DONE: "done"
            }
        },

        done: { type: "final" }
    },
})
