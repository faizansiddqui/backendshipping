const { router } = require('../app');
const pickup_table = require('../models/picupAddress.model')


router.post('/create/pickup_location', async (req, res) => {

      const {
        address_name,
        contact_name,
        contact_number,
        email,
        address_line,
        address_line2,
        pincode,
        gstin,
        dropship_location,
        use_alt_rto_address,
        rto_address,
        create_rto_address= {}
    } = req.body;


   let rto = create_rto_address;
    
    const {
      rto_address_name,
      rto_contact_name,
      rto_contact_number,
      rto_email,
      rto_address_line,
      rto_address_line2,
      rto_pincode,
      rto_gstin
    } = create_rto_address;

    const errors = [];

    // ------------------ MAIN PICKUP ADDRESS VALIDATION ------------------

    if (!address_name || address_name.trim().length < 1) {
        errors.push("address_name is mandatory and must have at least 1 character.");
    }

    if (!contact_name || !/^[A-Za-z ]+$/.test(contact_name)) {
        errors.push("contact_name is mandatory and should contain only alphabets.");
    }

    if (!contact_number || !/^\d{10}$/.test(contact_number)) {
        errors.push("contact_number is mandatory and must start with 7, 8, or 9 and be 10 digits long.");
    }

    if (!address_line || address_line.trim().length < 3 || address_line.trim().length > 100) {
        errors.push("address_line is mandatory and must be between 3 and 100 characters long.");
    }

    if (address_line2 && (address_line2.trim().length < 3 || address_line2.trim().length > 100)) {
        errors.push("address_line2 must be between 3 and 100 characters long if provided.");
    }

    if (!pincode || !/^\d{6}$/.test(pincode)) {
        errors.push("pincode is mandatory and must be a valid 6-digit number.");
    }

    if (gstin && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gstin)) {
        errors.push("gstin must be a valid GSTIN number if provided.");
    }

    if (typeof use_alt_rto_address !== 'boolean') {
        errors.push("use_alt_rto_address is mandatory and must be a boolean (true/false).");
    }

    if (dropship_location !== undefined && typeof dropship_location !== 'boolean') {
        errors.push("dropship_location must be a boolean value if provided.");
    }

    // ------------------ CONDITIONAL RTO ADDRESS VALIDATION ------------------

    if (use_alt_rto_address === true) {
        if (!rto_address_name || rto_address_name.trim().length < 1) {
            errors.push("rto_address_name is mandatory when use_alt_rto_address is true.");
        }

        if (!rto_contact_name || !/^[A-Za-z ]+$/.test(rto_contact_name)) {
            errors.push("rto_contact_name is mandatory and should contain only alphabets.");
        }

        if (!rto_contact_number || !/^\d{10}$/.test(rto_contact_number)) {
            errors.push("rto_contact_number is mandatory and must start with 7, 8, or 9 and be 10 digits long.");
        }

        if (!rto_address_line || rto_address_line.trim().length < 3 || rto_address_line.trim().length > 100) {
            errors.push("rto_address_line is mandatory and must be between 3 and 100 characters long.");
        }

        if (rto_address_line2 && (rto_address_line2.trim().length < 3 || rto_address_line2.trim().length > 100)) {
            errors.push("rto_address_line2 must be between 3 and 100 characters long if provided.");
        }

        if (!rto_pincode || !/^\d{6}$/.test(rto_pincode)) {
            errors.push("rto_pincode is mandatory and must be a valid 6-digit number.");
        }

        if (rto_gstin && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(rto_gstin)) {
            errors.push("rto_gstin must be a valid GSTIN number if provided.");
        }
    }else{
        rto = {}

    }

    // ------------------ ERROR HANDLING ------------------

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors
        });
    }
    // insert the data in the table
    const data = await pickup_table.create({
        address_name,
        contact_name,
        contact_number,
        email,
        address_line,
        address_line2,
        pincode,
        gstin,
        dropship_location,
        use_alt_rto_address,
        create_rto_address: rto
    })

    



    // ------------------ SUCCESS ------------------

    res.send(data);

    // res.json({
    //     success: true,
    //     message: "Order created successfully",
    //     data: {
    //         address_name,
    //         contact_name,
    //         contact_number,
    //         email,
    //         address_line,
    //         address_line2,
    //         pincode,
    //         gstin,
    //         dropship_location,
    //         use_alt_rto_address,
    //         create_rto_address
    //     }
    // });

})

router.post('/create-order', async (req, res) => {
  
});





module.exports = router;