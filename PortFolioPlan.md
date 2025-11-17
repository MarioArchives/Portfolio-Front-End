# Goal
This repo should contain two things:
- One, the ideas and layout for what the general structure of different projects would be and how they would link to the UI
- Two, a typescript UI which will serve as a way to connect my backend projects to an easily accessible front end.

## Projects

### Maze

1) Maze generator: the front end will contain a component that recieves a Json file with the information to generate a Maze.
This Json file will contain the following entries:

{
    dimensions: {
        width: W,
        height: L,
    },
    MazeBuildingProgression : {
        t_1 : [(1,3)], // Each instance should show the coordinates of a cell going from black to white.
        t_2 : [(2,4)],
        .
        .
        .
    }
}

The front end should then generate an efficient progression of the Maze filling up. 
