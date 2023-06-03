const { token } = require('morgan');

const   PROJECT_TABLE = 'project',
        Fs = require('fs'),
        { v4: uuidv4 } = require('uuid'),
        {secret_refresh} = require('../config'),
        {validationResult} = require('express-validator'),
        Project = require('../models/project'),
        path = require('path'),
        {CustomError, errorReplier} = require('../models/error'),
        jwt = require('jsonwebtoken');

class projectController{
    async get(req,res){
        try{ 
            const {refreshToken} = req.cookies;
            const project = new Project(PROJECT_TABLE);
            const result= await project.getUserProjects(getJwtUserId(refreshToken));
            return res.json(result);
        }
        catch(e){
            e.addMessage = 'Get projets';
            errorReplier(e,res);
        }
    }
    async getById(req,res){
        try{
            const errors = validationResult(req);
            if(! errors.isEmpty()){
                throw new CustomError(10);
            }
            const project = new Project(PROJECT_TABLE);
            const result= await project.getProject(req.params.id);
            return res.json(result);
        }catch(e){
            e.addMessage = 'Get event';
            errorReplier(e,res);
        }
    }
    async saveProject(req,res){
        try{
            const errors = validationResult(req);
            if(! errors.isEmpty()){
                throw new CustomError(10);
            }
            const {project_name, width, height, layers,filters,changeGlobalState,scale,editLayer,lastX,lastY,adjustedX,adjustedY,changeObjectsState,layerButtonsLogic}= req.body;
            const project = new Project(PROJECT_TABLE);
            const {refreshToken} = req.cookies;
            const nameProject= await project.getProjectByName(project_name);
            const userId  = getJwtUserId(refreshToken);
            console.log(nameProject)
            
            if(nameProject !== undefined && userId === nameProject.owner_id){
                console.log("zhopa")
                const projectData={
                    id:nameProject.id,
                    owner_id:userId,
                    project_name,
                    layers,
                    filters,
                    changeGlobalState,
                    scale,
                    editLayer,
                    lastX,
                    lastY,
                    adjustedX,
                    adjustedY,
                    width,
                    height,
                    changeObjectsState,
                    layerButtonsLogic
            }
            const pawn = await project.editProject(projectData,nameProject.id);
            return res.json(pawn)
        }
        else{
            console.log("pisun")
            const projectData={
                owner_id:userId,
                project_name,
                layers,
                filters,
                changeGlobalState,
                scale,
                editLayer,
                lastX,
                lastY,
                adjustedX,
                adjustedY,
                width, 
                height,
                changeObjectsState,
                layerButtonsLogic
            }
            const pawn = await project.setProject(projectData);
            return res.json(pawn)
        }
        }
        catch(e){
            e.addMessage = 'Create event';
            errorReplier(e,res);
        }
    }
    async editPhoto(req,res){
        console.log(req.files)
        try {
            
            if (!req.files || Object.keys(req.files).length === 0) {
              throw new CustomError(1012);
            }
            const project = new Project(PROJECT_TABLE);
            const {refreshToken} = req.cookies;
            const userLogin = getJwtUserLogin(refreshToken);
            const projectPown = await project.getById(req.params.id);
            const projectFolder = projectPown.project_name;
            const uploadDir = path.join('./public', userLogin, projectFolder);
            
            // Create user's directory if it doesn't exist
            if (!Fs.existsSync(uploadDir)) {
              Fs.mkdirSync(uploadDir, { recursive: true });
            }

            console.log(req.files)
            const file = req.files.image;
                const photoName = userLogin + '_' +file.name;
                const photoPath = path.join(uploadDir, photoName);
                file.mv(photoPath, function(err){
                    if(err) return res.status(500).send(err);
                });
            res.send('Success! File uploaded.');
          } catch (e) {
            e.addMessage = 'edit photoes';
            errorReplier(e, res);
          }
        }
    async deleteProject(req,res){
        try{
            const project = new Project(PROJECT_TABLE);
            const candidate = await project.getById(req.params.id);
            const {refreshToken} = req.cookies;
            checkProjectAndRelation(candidate,refreshToken)
            const pawn = await project.del({id: req.params.id})
            
            res.json(pawn);
        }catch(e){
            e.addMessage = 'Delete Project';
            errorReplier(e,res);
        }
    }
}
module.exports = new projectController()

function getJwtUserId(token){
    const decodedToken = jwt.verify(token, secret_refresh, { ignoreExpiration: true });
    console.log(decodedToken);
    return decodedToken.id;
}
function getJwtUserLogin(token){
    const decodedToken = jwt.verify(token, secret_refresh, { ignoreExpiration: true });
    console.log(decodedToken);
    return decodedToken.login;
}
function checkProjectAndRelation(candidate,token) {
    const decodedToken = jwt.verify(token, secret_refresh, { ignoreExpiration: true });
    const userId = decodedToken.id;
    if (!candidate){
        throw new CustomError(1006);
    } else if(userId != candidate.owner_id) throw new CustomError(1007);
}