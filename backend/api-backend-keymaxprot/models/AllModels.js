const mongoose = require('mongoose');
const User = require('./User');


// --- 2. Vehicle Schema (Colección: vehicles) ---
// Representa un vehículo único, con su propietario y conductores autorizados.
const Vehicle = require('./Vehicle');


const ServiceRecord = require('./ServiceRecord');

const MaintenancePlan = require('./MaintenancePlan');

const Shop = require('./Shop');


const Technician = require('./Technician');


const Product = require('./Product');


const Order = require('./Order');


const Payment = require('./Payment');


const Conversation = require('./Conversation');


const Message = require('./Message');
const Appointment = require('./Appointment');
const Tutorial = require('./Tutorial');
const Review = require('./Review');
const ServiceCatalog = require('./ServiceCatalog');
const Thread = require('./Thread');
const Post = require('./Post');


// --- Exportación de todos los modelos ---
module.exports = {
    User: User,
    Vehicle,
    ServiceRecord,
    Shop,
    Technician,
    Product,
    Order,
    Payment,
    Conversation,
    Message,
    Appointment,
    Tutorial,
    MaintenancePlan,
    Review,
    ServiceCatalog,
    Thread,
    Post,
};