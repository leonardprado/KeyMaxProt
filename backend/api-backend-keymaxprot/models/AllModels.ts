import mongoose, { Schema, Document, Model, Types } from 'mongoose';
import User, { IUser } from './User';
import Vehicle, { IVehicle } from './Vehicle';
import ServiceRecord, { IServiceRecord } from './ServiceRecord';
import MaintenancePlan, { IMaintenancePlan } from './MaintenancePlan';
import Shop, { IShop } from './Shop';
import Technician, { ITechnician } from '././Technician';
import Product, { IProduct } from './Product';
import Order, { IOrder } from './Order';
import Payment, { IPayment } from './Payment';
import Conversation, { IConversation } from './Conversation';
import Message, { IMessage } from './Message';
import Appointment, { IAppointment } from './Appointment';
import Tutorial, { ITutorial } from './Tutorial';
import Review, { IReview } from './Review';
import ServiceCatalog, { IServiceCatalog } from './ServiceCatalog';
import Thread, { IThread } from './Thread';
import Post, { IPost } from './Post';

export {
    User,
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

export type { IUser, IVehicle, IServiceRecord, IMaintenancePlan, IShop, ITechnician, IProduct, IOrder, IPayment, IConversation, IMessage, IAppointment, ITutorial, IReview, IServiceCatalog, IThread, IPost };