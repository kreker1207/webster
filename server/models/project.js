const { default: knex } = require('knex');
const knexfile = require('../db/knexfile');
const Entity = require('./entity');

module.exports = class Project extends Entity {
    constructor(tableName) {
        super(tableName);
    }
    async getProjectByName(name){
      if(name){
        return await super.table().select('project.*').where('project_name',name).first();
      }
    }
    async setProject(data){
        const knexInstance = knex(knexfile);
        const newProject = await
        knexInstance.transaction(async trx =>{
          const [newProject] = await trx('project').insert({
            owner_id: data.owner_id,
            project_name: data.project_name,
            changeGlobalState: data.changeGlobalState,
            scale: data.scale,
            editLayer: data.editLayer,
            lastX: data.lastX,
            lastY: data.lastY,
            adjustedX: data.adjustedX,
            adjustedY: data.adjustedY,
            changeObjectsState: data.changeObjectsState,
            layerButtonsLogic: data.layerButtonsLogic,
            width: data.width,
            height: data.height,
          }).returning('id');
      
          for (const layer of data.layers) {
            let layerId;
            if (layer.type === 'image') {
              const [newImage] = await trx('image').insert({
                name: layer.name,
                width: layer.width,
                height: layer.height,
              }).returning('id');
              const [newLayer] = await trx('layer').insert({
                project_id: newProject.id,
                type: layer.type,
                x: layer.x,
                y: layer.y,
                index:layer.index,
                visibleWidth: layer.visibleWidth,
                visibleHeight: layer.visibleHeight,
                lastX: layer.lastX,
                lastY: layer.lastY,
                adjustedX: layer.adjustedX,
                adjustedY: layer.adjustedY,
                rotate: layer.rotate,
                resize: layer.resize,
                image_id: newImage.id
              }).returning('id');
              layerId = newLayer;
            } else if (layer.type === 'text') {
              const [newText] = await trx('text').insert({
                name: layer.name,
                maxWidth:layer.maxWidth,
                fillStyle:layer.fillStyle,
                textAlign: layer.textAlign,
                fontSize: layer.fontSize,
                fontFamily: layer.fontFamily,
                italic: layer.fontType.italic,
                bold: layer.fontType.bold,
                textUnderlined:layer.textUnderlined,
                textCrossedOut: layer.textCrossedOut
              }).returning('id');
              const [newLayer] = await trx('layer').insert({
                project_id: newProject.id,
                type: layer.type,
                x: layer.x,
                y: layer.y,
                visibleWidth: layer.visibleWidth,
                visibleHeight: layer.visibleHeight,
                lastX: layer.lastX,
                lastY: layer.lastY,
                index:layer.index,
                adjustedX: layer.adjustedX,
                adjustedY: layer.adjustedY,
                rotate: layer.rotate,
                resize: layer.resize,
                text_id: newText.id,
              }).returning('id');
              layerId = newLayer;
            } else if (layer.type === 'graphicImg') {
              const [newGraphicImg] = await trx('graphic_img').insert({
                name: layer.name,
                width: layer.width,
                height: layer.height,
              }).returning('id');
              const [newLayer] = await trx('layer').insert({
                project_id: newProject.id,
                type: layer.type,
                x: layer.x,
                y: layer.y,
                visibleWidth: layer.visibleWidth,
                visibleHeight: layer.visibleHeight,
                lastX: layer.lastX,
                lastY: layer.lastY,
                index:layer.index,
                adjustedX: layer.adjustedX,
                adjustedY: layer.adjustedY,
                rotate: layer.rotate,
                resize: layer.resize,
                graphic_img_id: newGraphicImg.id,
              }).returning('id');
              layerId = newLayer;
            } else if ( layer.type === 'star' || layer.type === 'triangle90deg' || layer.type === 'polygon' ||
                        layer.type === 'circle' || layer.type === 'square') {
              const [newGraphic] = await trx('graphic').insert({
                name: layer.name,
                width: layer.width,
                height: layer.height,
                angles:layer.angles,
                color:layer.color,
                baseWidth:layer.baseWidth,
                baseHeight:layer.baseHeight
              }).returning('id');
              const [newLayer] = await trx('layer').insert({
                project_id: newProject.id,
                type: layer.type,
                x: layer.x,
                y: layer.y,
                visibleWidth: layer.visibleWidth,
                visibleHeight: layer.visibleHeight,
                lastX: layer.lastX,
                lastY: layer.lastY,
                index:layer.index,
                adjustedX: layer.adjustedX,
                adjustedY: layer.adjustedY,
                rotate: layer.rotate,
                resize: layer.resize,
                graphic_id: newGraphic.id,
              }).returning('id');
              layerId = newLayer;
            }
          }
              const filters = data.filters
              await trx('filter').insert({
                project_id: newProject.id,
                brightness: filters.brightness,
                blur: filters.blur,
                greyScale: filters.greyScale,
                hueRotate: filters.hueRotate,
                saturation: filters.saturation,
                contrast: filters.contrast,
              })
              return newProject;
        });
        return newProject;
    }
    async editProject(data, projectId) {
      console.log("////////////"+projectId)
      console.log("%%%%%%%%%%%%%%%% " +data)
      const knexInstance = knex(knexfile);
      const updatedProject = await knexInstance.transaction(async (trx) => {
        await trx('layer').where('project_id',projectId).del();
        
        await trx('project').where('id', projectId).update({
            owner_id: data.owner_id,
            project_name: data.project_name,
            changeGlobalState: data.changeGlobalState,
            scale: data.scale,
            editLayer: data.editLayer,
            lastX: data.lastX,
            lastY: data.lastY,
            adjustedX: data.adjustedX,
            adjustedY: data.adjustedY,
            changeObjectsState: data.changeObjectsState,
            layerButtonsLogic: data.layerButtonsLogic,
            width: data.width,
            height: data.height,
          });
          for (const layer of data.layers) {
            let layerId;
            if (layer.type === 'image') {
              const [newImage] = await trx('image').insert({
                name: layer.name,
                width: layer.width,
                height: layer.height,
              }).returning('id');
              const [newLayer] = await trx('layer').insert({
                project_id: projectId,
                type: layer.type,
                x:layer.x,
                y: layer.y,
                visibleWidth: layer.visibleWidth,
                visibleHeight: layer.visibleHeight,
                lastX: layer.lastX,
                lastY: layer.lastY,
                index:layer.index,
                adjustedX: layer.adjustedX,
                adjustedY: layer.adjustedY,
                rotate: layer.rotate,
                resize: layer.resize,
                image_id: newImage.id
              }).returning('id');
              layerId = newLayer;
            } else if (layer.type === 'text') {
              const [newText] = await trx('text').insert({
                name: layer.name,
                maxWidth:layer.maxWidth,
                fillStyle:layer.fillStyle,
                textAlign: layer.textAlign,
                fontSize: layer.fontSize,
                fontFamily: layer.fontFamily,
                italic: layer.fontType.italic,
                bold: layer.fontType.bold,
                textUnderlined:layer.textUnderlined,
                textCrossedOut: layer.textCrossedOut
              }).returning('id');
              const [newLayer] = await trx('layer').insert({
                project_id: projectId,
                type: layer.type,
                x: layer.x,
                y: layer.y,
                visibleWidth: layer.visibleWidth,
                visibleHeight: layer.visibleHeight,
                lastX: layer.lastX,
                lastY: layer.lastY,
                index:layer.index,
                adjustedX: layer.adjustedX,
                adjustedY: layer.adjustedY,
                rotate: layer.rotate,
                resize: layer.resize,
                text_id: newText.id,
              }).returning('id');
              layerId = newLayer;
            } else if (layer.type === 'graphicImg') {
              const [newGraphicImg] = await trx('graphic_img').insert({
                name: layer.name,
                width: layer.width,
                height: layer.height,
              }).returning('id');
              const [newLayer] = await trx('layer').insert({
                project_id:projectId,
                type: layer.type,
                x: layer.x,
                y: layer.y,
                visibleWidth: layer.visibleWidth,
                visibleHeight: layer.visibleHeight,
                lastX: layer.lastX,
                lastY: layer.lastY,
                index:layer.index,
                adjustedX: layer.adjustedX,
                adjustedY: layer.adjustedY,
                rotate: layer.rotate,
                resize: layer.resize,
                graphic_img_id: newGraphicImg.id,
              }).returning('id');
              layerId = newLayer;
            } else if (layer.type === 'star' || layer.type === 'triangle90deg' || layer.type === 'polygon' ||
                        layer.type === 'circle' || layer.type === 'square') {
              const [newGraphic] = await trx('graphic').insert({
                name: layer.name,
                angles:layer.angles,
                width: layer.width,
                height: layer.height,
                color:layer.color,
                baseWidth:layer.baseWidth,
                baseHeight:layer.baseHeight
              }).returning('id');
              const [newLayer] = await trx('layer').insert({
                project_id: projectId,
                type: layer.type,
                x: layer.x,
                y: layer.y,
                visibleWidth: layer.visibleWidth,
                visibleHeight: layer.visibleHeight,
                lastX: layer.lastX,
                lastY: layer.lastY,
                index:layer.index,
                adjustedX: layer.adjustedX,
                adjustedY: layer.adjustedY,
                rotate: layer.rotate,
                resize: layer.resize,
                graphic_id: newGraphic.id,
              }).returning('id');
              layerId = newLayer;
            }
          }
          const filters = data.filters;
          await trx('filter').where('project_id', projectId).update({
            brightness: filters.brightness,
            blur: filters.blur,
            greyScale: filters.greyScale,
            hueRotate: filters.hueRotate,
            saturation: filters.saturation,
            contrast: filters.contrast,
          });
          return trx('project').where('id', projectId).first();
        });
      
      return updatedProject;
  }
  async getProject(projectId) {
    const knexInstance = knex(knexfile);
    const project = await knexInstance.transaction(async (trx) => {
      const project = await trx('project').select('').where({ id: projectId }).first();
      if (!project) {
        return null;
      }
  
      const layers = await trx('layer').select('').where({ project_id: project.id });
  
      const connectedLayers = await Promise.all(layers.map(async (layer) => {
        const connectedLayer = { ...layer };
  
        if (layer.type === 'image') {
          connectedLayer.image = await trx('image').select('').where({ id: layer.image_id }).first();
        } else if (layer.type === 'text') {
          connectedLayer.text = await trx('text').select('').where({ id: layer.text_id }).first();
        } else if (layer.type === 'graphicImg') {
          connectedLayer.graphic_img = await trx('graphic_img').select('').where({ id: layer.graphic_img_id }).first();
        } else if ( layer.type === 'star' || layer.type === 'triangle90deg' || layer.type === 'polygon' ||
                    layer.type === 'circle' || layer.type === 'square') {
          connectedLayer.graphic = await trx('graphic').select('').where({ id: layer.graphic_id }).first();
        }
  
        return connectedLayer;
      }));
  
      const filters = await trx('filter').select('*').where({ project_id: project.id }).first();
  
      return {
        ...project,
        layers: connectedLayers,
        filters,
      };
    });
  
    return project;
  }
    async getUserProjects(userId){
      const knexInstance = knex(knexfile);
      const project = await knexInstance.transaction(async (trx) => {
        const project = await trx('project').select('*').where({ owner_id: userId })
    
        return project
        
      });
    
      return project;
    }
    
}
