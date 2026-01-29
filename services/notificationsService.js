const Notification = require("../models/Notification.model");

class NotificationService {
  static async notifyEventCreated(event, creator, tribbuId) {
    try {
      const Tribbu = require("../models/Tribbu.model");
      const tribbu = await Tribbu.findById(tribbuId).populate("members.userId");

      const memberIds = tribbu.members
        .filter((m) => m.userId._id.toString() !== creator._id.toString())
        .map((m) => m.userId._id);

      const notifications = memberIds.map((userId) => ({
        userId,
        tribbuId,
        eventId: event._id,
        type: "event_created",
        title: `Nuevo evento: ${event.title}`,
        message: `${creator.name} ha creado un nuevo evento: ${event.title}`,
      }));

      await Notification.insertMany(notifications);
    } catch (error) {
      console.error("Error notifying event created:", error);
    }
  }

  static async notifyEventUpdated(event, updater, tribbuId) {
    try {
      const Tribbu = require("../models/Tribbu.model");
      const tribbu = await Tribbu.findById(tribbuId).populate("members.userId");

      const memberIds = tribbu.members
        .filter((m) => m.userId._id.toString() !== updater._id.toString())
        .map((m) => m.userId._id);

      const notifications = memberIds.map((userId) => ({
        userId,
        tribbuId,
        eventId: event._id,
        type: "event_updated",
        title: `Evento actualizado: ${event.title}`,
        message: `${updater.name} ha actualizado el evento: ${event.title}`,
      }));

      await Notification.insertMany(notifications);
    } catch (error) {
      console.error("Error notifying event updated:", error);
    }
  }

  static async notifyEventDeleted(eventTitle, deleter, tribbuId) {
    try {
      const Tribbu = require("../models/Tribbu.model");
      const tribbu = await Tribbu.findById(tribbuId).populate("members.userId");

      const memberIds = tribbu.members
        .filter((m) => m.userId._id.toString() !== deleter._id.toString())
        .map((m) => m.userId._id);

      const notifications = memberIds.map((userId) => ({
        userId,
        tribbuId,
        type: "event_deleted",
        title: `Evento eliminado: ${eventTitle}`,
        message: `${deleter.name} ha eliminado el evento: ${eventTitle}`,
      }));

      await Notification.insertMany(notifications);
    } catch (error) {
      console.error("Error notifying event deleted:", error);
    }
  }

  static async notifyMemberJoined(tribbuName, newMember, tribbuId) {
    try {
      const Tribbu = require("../models/Tribbu.model");
      const tribbu = await Tribbu.findById(tribbuId).populate("members.userId");

      const memberIds = tribbu.members
        .filter((m) => m.userId._id.toString() !== newMember._id.toString())
        .map((m) => m.userId._id);

      const notifications = memberIds.map((userId) => ({
        userId,
        tribbuId,
        type: "member_joined",
        title: `Nuevo miembro en ${tribbuName}`,
        message: `${newMember.name} se ha unido a ${tribbuName}`,
      }));

      await Notification.insertMany(notifications);
    } catch (error) {
      console.error("Error notifying member joined:", error);
    }
  }

  static async notifyMemberRoleChanged(tribbuName, member, newRole, updater, tribbuId) {
    try {
      const notifications = {
        userId: member._id,
        tribbuId,
        type: "member_role_changed",
        title: `Tu rol cambió en ${tribbuName}`,
        message: `${updater.name} cambió tu rol a ${newRole} en ${tribbuName}`,
      };

      await Notification.create(notifications);
    } catch (error) {
      console.error("Error notifying member role changed:", error);
    }
  }
}

module.exports = NotificationService;