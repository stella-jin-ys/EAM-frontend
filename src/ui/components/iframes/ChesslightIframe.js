import { ConsoleLine } from "mdi-material-ui";
import React, { Component } from "react";
import WSEquipment from "../../../tools/WSEquipment";
import WSLocation from "../../../tools/WSLocation";
import WSParts from "../../../tools/WSParts";
import ResizableIframe from "./ResizableIframe";

class ChesslightIframe extends Component {
  constructor(props) {
    super(props);
    this.state = {
      actualEntity: {},
      src: "",
    };
  }

  docLightStyle = {
    autoResize: true,
    sizeWidth: true,
    minHeight: 600,
    width: "1px",
    minWidth: "100%",
    border: "none",
    height: "50%",
    boxShadow:
      "0px 1px 3px 0px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 2px 1px -1px rgba(0, 0, 0, 0.12)",
  };

  correctURLString(data) {
    return data.replace(/[^a-zA-Z0-9-_\s]/g, "");
  }

  equipmentParam = (equipmentData,params)=> {

    let locationData = null;
    let positionData = null;
    let partData = null;
    let listServices = [] ;
    if (equipmentData.partCode != null) {
      listServices.push(WSParts.getPart(equipmentData.partCode));
     }
     if (equipmentData.hierarchyLocationCode != null) {
      
      listServices.push(WSLocation.get(equipmentData.hierarchyLocationCode));
     }
     if (equipmentData.hierarchyPositionCode != null) {
      listServices.push(WSEquipment.getEquipment(equipmentData.hierarchyPositionCode));
    }
   

      Promise.all(listServices).then(responses => {
          responses.forEach(response => {
              if (response.body.data.code == equipmentData.partCode) {
                partData = response.body.data;
              } else if (response.body.data.code == equipmentData.hierarchyLocationCode) {
                locationData = response.body.data;
              } else if (response.body.data.code == equipmentData.hierarchyPositionCode) {
                positionData = response.body.data;
              }
          })
          // Asset/Position has location, show their documents too
          if (equipmentData.hierarchyLocationCode != null) {
            params.append(
              "entityEquipmentLocation",
              equipmentData.hierarchyLocationCode
            );
            params.append(
              "entityEquipmentLocationTag",
              locationData.userDefinedFields.udfchar01
            );
            params.append(
              "entityLocationDocChessId",
              locationData.userDefinedFields.udfchar05
            ); 
            console.log("positionData:",positionData);
          }
          // if Asset, then find the tag of the position by calling the equipment service again to fetch the tag with position code
          if (equipmentData.systemTypeCode=="A" && equipmentData.hierarchyPositionCode != null) {
            
              params.append(
                "entityEquipmentPosition",
                positionData.hierarchyPositionCode
              );
              params.append(
                "entityEquipmentPositionTag",
                positionData.userDefinedFields.udfchar01 //TAG
              );
              params.append(
                "entityPositionDocChessId",
                positionData.userDefinedFields.udfchar05
              );              
            } else if (equipmentData.systemTypeCode =="P") { // this is the case when WO has Position in equipment field
              params.append(
                "entityEquipmentPosition",
                equipmentData.hierarchyPositionCode
              );
              console.log("tag position:",equipmentData.userDefinedFields.udfchar01);
              params.append(
                "entityEquipmentPositionTag",
                equipmentData.userDefinedFields.udfchar01 // TAG
              );
              params.append(
                "entityPositionDocChessId",
                equipmentData.userDefinedFields.udfchar05
              ); 
            }
          if (equipmentData.systemTypeCode == "A" && equipmentData.partCode != null) {
              params.append("entityPartCode", partData.code);
              params.append(
                "entityPartDescription",
                this.correctURLString(partData.description)
              );
              params.append(
                "entityPartDocChessId",
                partData.userDefinedFields.udfchar02
              );
          }
          this.setState({ actualEntity: params.toString() });
        }).catch(error => {
       //this.props.handleError(error);
       console.log("res 1 error",error);
    });
    
  }
 
  /**
   * Triggered by React. Used to read existing entity or init new one depending on the URL
   *
   * @param nextProps
   */
  componentDidMount() {
    const {
      objectType,
      objectID,
      mode,
      profile,
      collapsible,
      entityDetails,
    } = this.props;

    let entities = {
      listEntites: [
        {
          fileName: "Test.txt",
          entityType: "Work Order",
          entityName: entityDetails.number,
          entityRevision: "1",
          eamDocTitle: entityDetails.description,
          eamDocDescription: entityDetails.description,
        },
        {
          fileName: "Test.txt",
          entityType: "Asset",
          entityName: entityDetails.equipmentCode,
          entityRevision: "1",
          eamDocTitle: entityDetails.equipmentDesc,
          eamDocDescription: entityDetails.equipmentDesc,
        },
        {
          fileName: "Test.txt",
          entityType: "EAM-Location",
          entityName: entityDetails.locationCode,
          entityRevision: "1",
          eamDocTitle: entityDetails.locationDesc,
          eamDocDescription: entityDetails.locationDesc,
        },
      ],
    };
    let actualEntity = {};
    const params = new URLSearchParams();
    if (
      "workorder" in entityDetails === true &&
      typeof entityDetails.workorder.number !== "undefined" &&
      entityDetails.workorder.number !== null
    ) {
      //actualEntity = {...entityDetails.workorder, entityTypeIdentifier: 'workorder'}
  
      params.append("entityTypeIdentifier", "workorder");
      WSEquipment.getEquipment(entityDetails.workorder.equipmentCode)
        .then((response) => {
          let equipmentData = response.body.data;

          params.append("entityCode", entityDetails.workorder.number);
          params.append(
            "entityDescription",
            this.correctURLString(entityDetails.workorder.description)
          );
          params.append(
            "entityEquipmentCode",
            entityDetails.workorder.equipmentCode
          );
          params.append(
            "entityEquipmentDocChessId",
            equipmentData.userDefinedFields.udfchar05
          );
          params.append(
            "entityEquipmentType",
            equipmentData.systemTypeCode
          );

          console.log("params:",params);
          
          //set all parameters and into state as well
          this.equipmentParam(equipmentData,params);
     
        })
        .catch((error) => {
          console.log("error in reading the equipment, since it is location:", entityDetails.workorder.equipmentCode,error);
          //this.props.handleError(error);
          //check if it is location, since location can not be fetched by equipment
          WSLocation.get(entityDetails.workorder.equipmentCode).then((response) => {
          let locationData = response.body.data;

          params.append("entityCode", entityDetails.workorder.number);
          params.append(
            "entityDescription",
            this.correctURLString(entityDetails.workorder.description)
          );
          params.append(
            "entityEquipmentCode",
            entityDetails.workorder.equipmentCode
          );
         
          params.append(
            "entityEquipmentType",
            "L" // WSLocation service doesn't return systemTypeCode
          );
          params.append(
            "entityEquipmentLocation",
            entityDetails.workorder.equipmentCode
          );
          params.append(
            "entityEquipmentLocationTag",
            locationData.userDefinedFields.udfchar01 //TAG
          );
          params.append(
            "entityEquipmentDocChessId",
            locationData.userDefinedFields.udfchar05
          );
         
          this.setState({ actualEntity: params.toString() });
        });
        });
    } else if ( //Position and Asset
      "equipment" in entityDetails === true &&
      typeof entityDetails.equipment.code !== "undefined" &&
      entityDetails.equipment.code !== null
    ) {
      
      //actualEntity = {...entityDetails.asset, entityTypeIdentifier: 'asset'}
      if (entityDetails.equipment.systemTypeCode=="A") {
        params.append("entityTypeIdentifier", "asset");
        } else if (entityDetails.equipment.systemTypeCode=="P") { 
          params.append("entityTypeIdentifier", "position");
        }
      
      params.append("entityEquipmentType", entityDetails.equipment.systemTypeCode);

      params.append("entityCode", entityDetails.equipment.code);
      params.append(
        "entityDescription",
        this.correctURLString(entityDetails.equipment.description)
      );
      params.append(
            "entityEquipmentDocChessId",
            entityDetails.equipment.userDefinedFields.udfchar05
          );
      this.equipmentParam(entityDetails.equipment,params);
      
    } else if (
      "location" in entityDetails === true &&
      typeof entityDetails.location.code !== "undefined" &&
      entityDetails.location.code !== null
    ) {
      //actualEntity = {...entityDetails.location, entityTypeIdentifier: 'location'};
      let typeIdentifier = null;
      if (entityDetails.location.typeCode === "P") {
        typeIdentifier = "position";
      } else {
        typeIdentifier = "location";
      }
      params.append("entityCode", entityDetails.location.code);
      params.append("entityEquipmentLocationTag", entityDetails.location.userDefinedFields.udfchar01);
      params.append(
        "entityDescription",
        this.correctURLString(entityDetails.location.description)
      );
      params.append("entityTypeIdentifier", typeIdentifier);
      this.setState({ actualEntity: params.toString() });
    } else if (
      entityDetails.entityCode === "PART" &&
      typeof entityDetails.entityKeyCode !== "undefined" &&
      entityDetails.entityKeyCode !== null
    ) {
      WSParts.getPart(entityDetails.entityKeyCode)
        .then((response) => {
          let partData = response.body.data;
          params.append("entityCode", partData.code);
          params.append(
            "entityDescription",
            this.correctURLString(partData.description)
          );
          params.append(
            "entityPartDocChessId",
            partData.userDefinedFields.udfchar02
          );
          params.append("entityTypeIdentifier", "part");
          this.setState({ actualEntity: params.toString() });
        })
        .catch((error) => {
          this.props.handleError(error);
        });
    }
  }

  render() {
    //let entityDetailsList = JSON.stringify(this.state.actualEntity);
    //const src = `${this.props.edmsdoclightURL}/${entityDetailsList}`;
    //This check is added, since it iframe tries to load the page with empty object
   //if ("entityCode" in this.state.actualEntity === true) 
   {
        const src = `${this.props.edmsdoclightURL}?${this.state.actualEntity}`;
       
        if (
         //hack to show blank untill real URL is called
          (src.includes('entityCode'))
         ) {
        return (
          <ResizableIframe
            iframeResizerOptions={{
              scrolling: true,
              checkOrigin: false, // CHECK: disable this option or list allowed origins
              heightCalculationMethod: "bodyOffset",
            }}
            src={src}
            style={this.docLightStyle}
          />
        );
          } else 
          return (
          <div style={this.mainDivStyle}>
      </div>);
    }   
  }
}

ChesslightIframe.defaultProps = {
  mode: "write",
  profile: "EAMLIGHT",
  collapsible: true,
};

export default ChesslightIframe;
