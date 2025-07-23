const Scan = require('../models/scan');
const accessibilityService = require('../services/accessibilityService');

const isvalidUrl = (string) => {
    try{
        new URL(string);
        return true;
    }
    catch (_){
        return false;
    }
}

//create new scan
exports.createScan = async (req , res) => {
    try{
        const {url} = req.body;

        //validate url
        if(!url || !isvalidUrl(url)){
            return res.status(400).json({
                success:false,
                message: 'Please Provide A Valid URL'
            })
        }

        //CREATE scan record
        const scan = new Scan({url})
        await scan.save();

        //return scan ID immediately
        res.status(201).json({
            success:true,
            scanId: scan._id,
            message: 'scan initiated successfuly'
        });
        
        //perform scan asynchoronously
        try{
            const results = await accessibilityService.scanUrl(url);

            //update scan with results
            scan.results = results;
            scan.status = 'completed';
            scan.completedAt = new Date();
            await scan.save();
        }
        catch (error){
            scan.status = 'failed';
            scan.completedAt = new Date();
            await scan.save();
            console.error('scan failed:', error.message);
        }
    }
    catch (error){
        console.error('Error creating scan: ', error.message);
        res.status(500).json({
            success: false,
            message: 'Server Error Occurred' 
        });
    }
};

//get scan results
exports.getScan = async(req, res) => {
    try{
        const {id} = req.params;
        const scan = await Scan.findById(id);

        if(!scan){
            return res.status(404).json({
                success: false,
                message: 'scan not found'
            });
        }

        res.json({
            success: true,
            scan:{
                id: scan._id,
                url:scan.url,
                status:scan.status,
                results:scan.results,
                createdAt:scan.createdAt,
                completedAt:scan.completedAt
            }
        })
    }
    catch(error){
        console.error('Error fetching scan:', error.message);
        res.status(500).json({
            success: false,
            message: 'server error occurred'
        });
    }
};