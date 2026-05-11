import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getUnreadCount = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return 0;

    const user = await ctx.db
      .query("users")
      .withIndex("by_externalId", (q) => q.eq("externalId", identity.subject))
      .unique();

    if (!user) return 0;

    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_userId_isRead", (q) => 
        q.eq("userId", user._id).eq("isRead", false)
      )
      .filter((q) => q.eq(q.field("workspaceId"), args.workspaceId))
      .collect();

    return notifications.length;
  },
});

export const list = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query("users")
      .withIndex("by_externalId", (q) => q.eq("externalId", identity.subject))
      .unique();

    if (!user) return [];

    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_userId_and_workspaceId", (q) => 
        q.eq("userId", user._id).eq("workspaceId", args.workspaceId)
      )
      .order("desc")
      .take(20);

    return await Promise.all(
      notifications.map(async (notification) => {
        const message = await ctx.db.get(notification.messageId);
        const author = message ? await ctx.db.get(message.authorId) : null;
        const channel = await ctx.db.get(notification.channelId);

        return {
          ...notification,
          message,
          author,
          channel,
        };
      })
    );
  },
});

export const markAsRead = mutation({
  args: { id: v.id("notifications") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const notification = await ctx.db.get(args.id);
    if (!notification) throw new Error("Notification not found");

    const user = await ctx.db
      .query("users")
      .withIndex("by_externalId", (q) => q.eq("externalId", identity.subject))
      .unique();

    if (!user || user._id !== notification.userId) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.id, { isRead: true });
  },
});

export const markAllAsRead = mutation({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const user = await ctx.db
      .query("users")
      .withIndex("by_externalId", (q) => q.eq("externalId", identity.subject))
      .unique();

    if (!user) throw new Error("User not found");

    const unread = await ctx.db
      .query("notifications")
      .withIndex("by_userId_isRead", (q) => 
        q.eq("userId", user._id).eq("isRead", false)
      )
      .filter((q) => q.eq(q.field("workspaceId"), args.workspaceId))
      .collect();

    for (const notification of unread) {
      await ctx.db.patch(notification._id, { isRead: true });
    }
  },
});
