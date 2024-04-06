

// const fundingOpportunity = require("../model/fundingOpportunity");


// const fundingOpportunityController = async(req,res) =>{ //api

//     try {
//         const {
//             Additional_Information_on_Eligibility_c,

//             Agency_c,

//             Agency_Name_c,

//             ApplicationDueDate_c,

//             Application_Information__c,

//             Application_Owner__c,

//             ArchiveDate__c,

//             CreatedById,

//             Description__c,

//             Eligibility_and_Selection__c,

//             Eligible_Applicants__c,

//             End_Date__c,

//             Funding_Opportunity_Code__c,

//             Funding_Opportunity_Title_Image__c,

//             Name,

//             Grants_gov_Url__c,

//             InternalUniqueID__c,

//             Is_PreApplication_Available__c,

//             LastModifiedById,

//             Meetings_and_Trainings__c,

//             OwnerId,

//             Program__c,

//             Program_Name__c,

//             Purpose__c,

//             Questionnaire__c,

//             RecordTypeId,

//             Funded_Amount__c,

//             Start_Date__c,

//             Status__c,

//             Total_Allocated_amount__c,

//             Total_Award__c,

//             Total_Quarter__c,

//             Type__c


//         } = req.body;  // this is carry the data from schema.

//         const response = await fundingOpportunity.create(req.body);
//         console.log(response);
//         res.status(201).json(response);
//     } catch (error) {
//         console.log("Internal server error : ", error);
        
//     }
// }








// const deletefundingOpportunity = async (req,res)=>{
//    try {
//       const {id}=req.params;
//       const deletefundingOpportunity = await fundingOpportunity.findByIdAndDelete(id);

//       if(!deletefundingOpportunity){
//          return res.status(404).json({error:"application not found"});
//       }
//       res.status(200).json({message:"Funding opportunity deleted succefully"})
//    } catch (error) {
      
//    }


// }



// const updatefundingOpportunity = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const update = req.body;
//         const updatedFundingOpportunity = await fundingOpportunity.findByIdAndUpdate(id, update, { new: true });

//         if (!updatedFundingOpportunity) {
//             return res.status(404).json({ error: "Funding opportunity not found" });
//         }
        
//         res.status(200).json({ message: "Funding opportunity updated successfully", updatedFundingOpportunity });
//     } catch (error) {
//         console.error("Error updating funding opportunity:", error);
//         res.status(500).json({ error: "Internal server error" });
//     }
// }

// module.exports = { fundingOpportunityController, updatefundingOpportunity,deletefundingOpportunity };
