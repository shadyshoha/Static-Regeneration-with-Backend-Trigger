# Studies on Static Regeneration with Backend Trigger

This git contains the code link to the Master Thesis of Shady AL SHOHA in pursuit of the Master's degree in computer science engineering at the Ecole Polytechnique de Bruxelles. The writing of the Master Thesis is supervised by Pr. Mahmoud Sakr, professor at the Université Libre de Bruxelles. 

The author transfers to any and all rights to this code and all contribution to the project without any limitation in time nor space. The author gives permission to make this code available for consultation and to copy parts of this code for personal use. In all cases of other use, the copyright terms have to be respected, in particular with regard to the obligation to state explicitly the source when quoting results from this code.

In order to launch this code you need to run

```
npm install
npm run start
```

This will launch the server and the different route will be accessible in the port 8080. To see the home page of the web application go to http://localhost:8080

In order to make the tests, launch the following code after having installed ts-node 

```
npm install 
ts-node test.ts
```

For running the test in the best configuration for the benchmarking, you need to launch docker. If docker is not already installed in your system, please visit https://www.docker.com/get-started/. Once docker installed, you need to run in the root folder of this project: 

```
npm run docker-start
```

If you have comments or questions about this project please contact me at shady.al.shoha@ulb.be. 