import { mutation } from "./_generated/server";
import { v } from "convex/values";

const DUMMY_USERS = [
  {
    name: "Jane Doe",
    email: "jane@example.com",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
    externalId: "dummy_jane",
  },
  {
    name: "John Smith",
    email: "john@example.com",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    externalId: "dummy_john",
  },
  {
    name: "Alice Johnson",
    email: "alice@example.com",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
    externalId: "dummy_alice",
  },
  {
    name: "Bob Wilson",
    email: "bob@example.com",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
    externalId: "dummy_bob",
  },
];

export const createDummyUsers = mutation({
  args: {
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const userIds = [];
    
    for (const dummy of DUMMY_USERS) {
      // Check if user already exists
      const existingUser = await ctx.db
        .query("users")
        .withIndex("by_externalId", (q) => q.eq("externalId", dummy.externalId))
        .unique();
      
      let userId;
      if (existingUser) {
        userId = existingUser._id;
      } else {
        userId = await ctx.db.insert("users", {
          ...dummy,
          lastSeen: Date.now(),
        });
      }
      userIds.push(userId);

      // Check if member already exists in this workspace
      const existingMember = await ctx.db
        .query("members")
        .withIndex("by_userId_and_workspaceId", (q) => 
          q.eq("userId", userId).eq("workspaceId", args.workspaceId)
        )
        .unique();
      
      if (!existingMember) {
        await ctx.db.insert("members", {
          userId,
          workspaceId: args.workspaceId,
          role: "member",
        });
      }
    }
    
    return userIds;
  },
});
