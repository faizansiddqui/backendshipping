const { db, DataTypes } = require('../config/db');

const PickupTable = db.define('PickupTable', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    // ------------------ MAIN PICKUP ADDRESS ------------------

    address_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'address_name is mandatory' },
            len: { args: [1, 100], msg: 'address_name must have at least 1 character' }
        }
    },

    contact_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'contact_name is mandatory' },
            is: {
                args: /^[A-Za-z ]+$/i,
                msg: 'contact_name should contain only alphabets'
            }
        }
    },

    contact_number: {
        type: DataTypes.STRING,
        allowNull: false,
       
        
    },

    email: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isEmail: { msg: 'email must be valid if provided' }
        }
    },

    address_line: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'address_line is mandatory' },
            len: { args: [3, 100], msg: 'address_line must be between 3 and 100 characters long' }
        }
    },

    address_line2: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            len: { args: [3, 100], msg: 'address_line2 must be between 3 and 100 characters long if provided' }
        }
    },

    pincode: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'pincode is mandatory' },
            is: {
                args: /^\d{6}$/,
                msg: 'pincode must be a valid 6-digit number'
            }
        }
    },

    gstin: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            is: {
                args: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i,
                msg: 'gstin must be valid if provided'
            }
        }
    },

    dropship_location: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
    },

    use_alt_rto_address: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        validate: {
            notNull: { msg: 'use_alt_rto_address is mandatory' }
        }
    },

    // ------------------ RTO ADDRESS (stored as one JSON object) ------------------

    create_rto_address: {
        type: DataTypes.JSON, // use JSONB if using PostgreSQL
        allowNull: true,
        validate: {
            isValidRtoAddress(value) {
                if (!this.use_alt_rto_address) return; // skip if not using alternate RTO

                if (!value) {
                    throw new Error('create_rto_address is mandatory when use_alt_rto_address is true');
                }

                const {
                    rto_address_name,
                    rto_contact_name,
                    rto_contact_number,
                    rto_address_line,
                    rto_pincode
                } = value;

                if (!rto_address_name || rto_address_name.trim().length < 1) {
                    throw new Error('rto_address_name must have at least 1 character');
                }
                if (!/^[A-Za-z ]+$/.test(rto_contact_name || '')) {
                    throw new Error('rto_contact_name should contain only alphabets');
                }
                if (!/^\d{10}$/.test(rto_contact_number || '')) {
                    throw new Error('rto_contact_number must be 10 digits long');
                }
                if (!rto_address_line || rto_address_line.trim().length < 3 || rto_address_line.trim().length > 100) {
                    throw new Error('rto_address_line must be between 3 and 100 characters long');
                }
                if (!/^\d{6}$/.test(rto_pincode || '')) {
                    throw new Error('rto_pincode must be a valid 6-digit number');
                }
            }
        }
    }

}, {
    tableName: 'pickup_table',
    timestamps: true
});

module.exports = PickupTable;
