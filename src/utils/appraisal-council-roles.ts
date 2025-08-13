// import { UserRole } from "@/types/auth";
// import {
//   SelectedMember,
//   AppraisalCouncilRoleType,
//   MemberRoleUpdate,
// } from "@/types/appraisal-council";

// /**
//  * Filter members to handle duplicate account IDs according to the specified logic:
//  * - If account-id appears only once → keep the same
//  * - If account-id appears twice → get the one with role "Appraisal Council"
//  */
// export function filterMembersForDisplay(members: UserRole[]): UserRole[] {
//   const accountGroups = new Map<string, UserRole[]>();

//   // Group members by account-id
//   members.forEach((member) => {
//     const accountId = member["account-id"];
//     if (!accountGroups.has(accountId)) {
//       accountGroups.set(accountId, []);
//     }
//     accountGroups.get(accountId)!.push(member);
//   });

//   // Apply filtering logic
//   const filteredMembers: UserRole[] = [];
//   accountGroups.forEach((memberGroup) => {
//     if (memberGroup.length === 1) {
//       // If account-id appears only once → keep the same
//       filteredMembers.push(memberGroup[0]);
//     } else {
//       // If account-id appears multiple times → get the one with role "Appraisal Council"
//       const appraisalCouncilMember = memberGroup.find(
//         (m) => m.name === "Appraisal Council"
//       );
//       if (appraisalCouncilMember) {
//         filteredMembers.push(appraisalCouncilMember);
//       } else {
//         // Fallback: take the first one if no "Appraisal Council" role found
//         filteredMembers.push(memberGroup[0]);
//       }
//     }
//   });

//   return filteredMembers;
// }

// /**
//  * Convert UserRole to SelectedMember with proper role mapping
//  */
// export function convertUserRoleToSelectedMember(
//   userRole: UserRole
// ): SelectedMember {
//   // Map role names to our AppraisalCouncilRoleType
//   let roleName: AppraisalCouncilRoleType = "Appraisal Council";
//   if (userRole.name === "Chairman") {
//     roleName = "Chairman";
//   } else if (userRole.name === "Secretary") {
//     roleName = "Secretary";
//   }

//   return {
//     id: userRole.id,
//     "account-id": userRole["account-id"],
//     "full-name": userRole["full-name"],
//     email: userRole.email,
//     "avatar-url": userRole["avatar-url"],
//     "role-id": userRole["role-id"],
//     "role-name": roleName,
//   };
// }

// /**
//  * Get available roles for selection based on current members
//  * Hide Chairman/Secretary if already selected by someone else
//  */
// export function getAvailableRoles(
//   currentMembers: SelectedMember[],
//   currentMemberAccountId?: string
// ): AppraisalCouncilRoleType[] {
//   const allRoles: AppraisalCouncilRoleType[] = [
//     "Appraisal Council",
//     "Chairman",
//     "Secretary",
//   ];

//   // Find roles already taken by other members
//   const takenRoles = currentMembers
//     .filter((member) => member["account-id"] !== currentMemberAccountId)
//     .map((member) => member["role-name"]);

//   // Return roles that are not taken by others
//   return allRoles.filter((role) => {
//     if (role === "Appraisal Council") {
//       return true; // Appraisal Council can have multiple members
//     }
//     return !takenRoles.includes(role); // Chairman and Secretary are unique
//   });
// }

// /**
//  * Determine role management actions needed when updating a member's role
//  */
// export function determineRoleActions(
//   accountId: string,
//   newRole: AppraisalCouncilRoleType,
//   currentUserRoles: UserRole[],
//   appraisalCouncilId: string,
//   allRoles: { id: string; name: string }[]
// ): MemberRoleUpdate[] {
//   const actions: MemberRoleUpdate[] = [];

//   // Find role IDs
//   const appraisalCouncilRole = allRoles.find(
//     (r) => r.name === "Appraisal Council"
//   );
//   const chairmanRole = allRoles.find((r) => r.name === "Chairman");
//   const secretaryRole = allRoles.find((r) => r.name === "Secretary");

//   if (!appraisalCouncilRole) {
//     throw new Error("Appraisal Council role not found");
//   }

//   // Filter current roles for this appraisal council
//   const councilRoles = currentUserRoles.filter(
//     (role) => role["appraisal-council-id"] === appraisalCouncilId
//   );

//   const hasAppraisalCouncil = councilRoles.some(
//     (r) => r.name === "Appraisal Council"
//   );
//   const hasChairman = councilRoles.some((r) => r.name === "Chairman");
//   const hasSecretary = councilRoles.some((r) => r.name === "Secretary");

//   if (newRole === "Appraisal Council") {
//     // Update to Appraisal Council
//     if (hasChairman) {
//       // Delete Chairman role
//       const chairmanUserRole = councilRoles.find((r) => r.name === "Chairman");
//       if (chairmanUserRole) {
//         actions.push({
//           action: "delete",
//           accountId,
//           roleId: chairmanUserRole["role-id"],
//           roleName: "Chairman",
//           userRoleId: chairmanUserRole.id,
//         });
//       }
//     }
//     if (hasSecretary) {
//       // Delete Secretary role
//       const secretaryUserRole = councilRoles.find(
//         (r) => r.name === "Secretary"
//       );
//       if (secretaryUserRole) {
//         actions.push({
//           action: "delete",
//           accountId,
//           roleId: secretaryUserRole["role-id"],
//           roleName: "Secretary",
//           userRoleId: secretaryUserRole.id,
//         });
//       }
//     }
//     if (!hasAppraisalCouncil) {
//       // Create Appraisal Council role
//       actions.push({
//         action: "create",
//         accountId,
//         roleId: appraisalCouncilRole.id,
//         roleName: "Appraisal Council",
//       });
//     }
//   } else if (newRole === "Chairman") {
//     if (!chairmanRole) {
//       throw new Error("Chairman role not found");
//     }

//     if (hasSecretary) {
//       // Delete Secretary, add Chairman
//       const secretaryUserRole = councilRoles.find(
//         (r) => r.name === "Secretary"
//       );
//       if (secretaryUserRole) {
//         actions.push({
//           action: "delete",
//           accountId,
//           roleId: secretaryUserRole["role-id"],
//           roleName: "Secretary",
//           userRoleId: secretaryUserRole.id,
//         });
//       }
//     }

//     if (!hasAppraisalCouncil) {
//       // Create Appraisal Council role
//       actions.push({
//         action: "create",
//         accountId,
//         roleId: appraisalCouncilRole.id,
//         roleName: "Appraisal Council",
//       });
//     }

//     if (!hasChairman) {
//       // Create Chairman role
//       actions.push({
//         action: "create",
//         accountId,
//         roleId: chairmanRole.id,
//         roleName: "Chairman",
//       });
//     }
//   } else if (newRole === "Secretary") {
//     if (!secretaryRole) {
//       throw new Error("Secretary role not found");
//     }

//     if (hasChairman) {
//       // Delete Chairman, add Secretary
//       const chairmanUserRole = councilRoles.find((r) => r.name === "Chairman");
//       if (chairmanUserRole) {
//         actions.push({
//           action: "delete",
//           accountId,
//           roleId: chairmanUserRole["role-id"],
//           roleName: "Chairman",
//           userRoleId: chairmanUserRole.id,
//         });
//       }
//     }

//     if (!hasAppraisalCouncil) {
//       // Create Appraisal Council role
//       actions.push({
//         action: "create",
//         accountId,
//         roleId: appraisalCouncilRole.id,
//         roleName: "Appraisal Council",
//       });
//     }

//     if (!hasSecretary) {
//       // Create Secretary role
//       actions.push({
//         action: "create",
//         accountId,
//         roleId: secretaryRole.id,
//         roleName: "Secretary",
//       });
//     }
//   }

//   return actions;
// }

// /**
//  * Determine delete actions for removing a member
//  */
// export function determineMemberDeleteActions(
//   currentUserRoles: UserRole[],
//   appraisalCouncilId: string,
//   allMembers: UserRole[]
// ): MemberRoleUpdate[] {
//   const actions: MemberRoleUpdate[] = [];

//   // Filter current roles for this appraisal council
//   const councilRoles = currentUserRoles.filter(
//     (role) => role["appraisal-council-id"] === appraisalCouncilId
//   );

//   // Check if account-id matches another role in the council
//   const accountId = currentUserRoles[0]?.["account-id"];
//   if (!accountId) return actions;

//   const otherMembersWithSameAccount = allMembers.filter(
//     (member) =>
//       member["account-id"] === accountId &&
//       member["appraisal-council-id"] === appraisalCouncilId
//   );

//   if (otherMembersWithSameAccount.length <= 1) {
//     // Delete all roles for this account
//     councilRoles.forEach((role) => {
//       actions.push({
//         action: "delete",
//         accountId,
//         roleId: role["role-id"],
//         roleName: role.name as AppraisalCouncilRoleType,
//         userRoleId: role.id,
//       });
//     });
//   } else {
//     // Delete only the duplicate role (keep Appraisal Council)
//     const duplicateRole = councilRoles.find(
//       (r) => r.name !== "Appraisal Council"
//     );
//     if (duplicateRole) {
//       actions.push({
//         action: "delete",
//         accountId,
//         roleId: duplicateRole["role-id"],
//         roleName: duplicateRole.name as AppraisalCouncilRoleType,
//         userRoleId: duplicateRole.id,
//       });
//     }
//   }

//   return actions;
// }

import { UserRole } from "@/types/auth";
import {
  SelectedMember,
  AppraisalCouncilRoleType,
  MemberRoleUpdate,
} from "@/types/appraisal-council";

/**
 * Filter members to handle duplicate account IDs with priority logic:
 * - If account-id appears only once → keep the same
 * - If account-id appears multiple times → prioritize Chairman > Secretary > Appraisal Council
 */
export function filterMembersForDisplay(members: UserRole[]): UserRole[] {
  console.log(
    "🔍 Starting filterMembersForDisplay with members:",
    members.length
  );
  console.log(
    "📋 Input members:",
    members.map((m) => ({
      id: m.id,
      accountId: m["account-id"],
      name: m.name,
      fullName: m["full-name"],
    }))
  );

  const accountGroups = new Map<string, UserRole[]>();

  // Group members by account-id
  members.forEach((member) => {
    const accountId = member["account-id"];
    if (!accountGroups.has(accountId)) {
      accountGroups.set(accountId, []);
    }
    accountGroups.get(accountId)!.push(member);
  });

  console.log(
    "👥 Account groups:",
    Array.from(accountGroups.entries()).map(([accountId, roles]) => ({
      accountId,
      rolesCount: roles.length,
      roles: roles.map((r) => ({
        id: r.id,
        name: r.name,
        fullName: r["full-name"],
      })),
    }))
  );

  // Define role priority (higher number = higher priority)
  const getRolePriority = (roleName: string): number => {
    switch (roleName) {
      case "Chairman":
        return 3;
      case "Secretary":
        return 2;
      case "Appraisal Council":
        return 1;
      default:
        return 0;
    }
  };

  // Apply filtering logic with priority
  const filteredMembers: UserRole[] = [];
  accountGroups.forEach((memberGroup, accountId) => {
    console.log(
      `🔍 Processing account ${accountId} with ${memberGroup.length} roles`
    );

    if (memberGroup.length === 1) {
      // If account-id appears only once → keep the same
      console.log(`✅ Single role for ${accountId}: ${memberGroup[0].name}`);
      filteredMembers.push(memberGroup[0]);
    } else {
      // If account-id appears multiple times → prioritize by role hierarchy
      console.log(
        `🔄 Multiple roles for ${accountId}:`,
        memberGroup.map((m) => m.name)
      );

      // Sort by priority (highest first)
      const sortedMembers = memberGroup.sort((a, b) => {
        const priorityA = getRolePriority(a.name);
        const priorityB = getRolePriority(b.name);
        return priorityB - priorityA;
      });

      const selectedMember = sortedMembers[0];
      console.log(
        `🏆 Selected highest priority role for ${accountId}: ${
          selectedMember.name
        } (priority: ${getRolePriority(selectedMember.name)})`
      );
      filteredMembers.push(selectedMember);
    }
  });

  console.log(
    "✨ Final filtered members:",
    filteredMembers.map((m) => ({
      id: m.id,
      accountId: m["account-id"],
      name: m.name,
      fullName: m["full-name"],
    }))
  );

  console.log(
    `📊 Summary: ${members.length} input → ${
      filteredMembers.length
    } filtered (${members.length - filteredMembers.length} duplicates removed)`
  );

  return filteredMembers;
}

/**
 * Convert UserRole to SelectedMember with proper role mapping
 */
export function convertUserRoleToSelectedMember(
  userRole: UserRole
): SelectedMember {
  console.log("🔄 Converting UserRole to SelectedMember:", {
    id: userRole.id,
    accountId: userRole["account-id"],
    roleName: userRole.name,
    fullName: userRole["full-name"],
  });

  // Map role names to our AppraisalCouncilRoleType
  let roleName: AppraisalCouncilRoleType = "Appraisal Council";
  if (userRole.name === "Chairman") {
    roleName = "Chairman";
  } else if (userRole.name === "Secretary") {
    roleName = "Secretary";
  }

  const selectedMember: SelectedMember = {
    id: userRole.id,
    "account-id": userRole["account-id"],
    "full-name": userRole["full-name"],
    email: userRole.email,
    "avatar-url": userRole["avatar-url"],
    "role-id": userRole["role-id"],
    "role-name": roleName,
  };

  console.log("✅ Converted to SelectedMember:", {
    id: selectedMember.id,
    accountId: selectedMember["account-id"],
    roleName: selectedMember["role-name"],
    fullName: selectedMember["full-name"],
  });

  return selectedMember;
}

/**
 * Get available roles for selection based on current members
 * Hide Chairman/Secretary if already selected by someone else
 */
export function getAvailableRoles(
  currentMembers: SelectedMember[],
  currentMemberAccountId?: string
): AppraisalCouncilRoleType[] {
  console.log("🎭 Getting available roles for:", currentMemberAccountId);
  console.log(
    "👥 Current members:",
    currentMembers.map((m) => ({
      accountId: m["account-id"],
      roleName: m["role-name"],
      fullName: m["full-name"],
    }))
  );

  const allRoles: AppraisalCouncilRoleType[] = [
    "Appraisal Council",
    "Chairman",
    "Secretary",
  ];

  // Find roles already taken by other members
  const takenRoles = currentMembers
    .filter((member) => member["account-id"] !== currentMemberAccountId)
    .map((member) => member["role-name"]);

  console.log("🚫 Roles taken by others:", takenRoles);

  // Return roles that are not taken by others
  const availableRoles = allRoles.filter((role) => {
    if (role === "Appraisal Council") {
      return true; // Appraisal Council can have multiple members
    }
    return !takenRoles.includes(role); // Chairman and Secretary are unique
  });

  console.log("✅ Available roles:", availableRoles);
  return availableRoles;
}

/**
 * Determine role management actions needed when updating a member's role
 */
export function determineRoleActions(
  accountId: string,
  newRole: AppraisalCouncilRoleType,
  currentUserRoles: UserRole[],
  appraisalCouncilId: string,
  allRoles: { id: string; name: string }[]
): MemberRoleUpdate[] {
  console.log("🎯 Determining role actions for:", {
    accountId,
    newRole,
    appraisalCouncilId,
    currentRolesCount: currentUserRoles.length,
  });

  console.log(
    "📋 Current user roles:",
    currentUserRoles.map((r) => ({
      id: r.id,
      name: r.name,
      roleId: r["role-id"],
      appraisalCouncilId: r["appraisal-council-id"],
    }))
  );

  const actions: MemberRoleUpdate[] = [];

  // Find role IDs
  const appraisalCouncilRole = allRoles.find(
    (r) => r.name === "Appraisal Council"
  );
  const chairmanRole = allRoles.find((r) => r.name === "Chairman");
  const secretaryRole = allRoles.find((r) => r.name === "Secretary");

  console.log("🔍 Available role IDs:", {
    appraisalCouncil: appraisalCouncilRole?.id,
    chairman: chairmanRole?.id,
    secretary: secretaryRole?.id,
  });

  if (!appraisalCouncilRole) {
    console.error("❌ Appraisal Council role not found");
    throw new Error("Appraisal Council role not found");
  }

  // Filter current roles for this appraisal council
  const councilRoles = currentUserRoles.filter(
    (role) => role["appraisal-council-id"] === appraisalCouncilId
  );

  console.log(
    "🏛️ Council roles for this appraisal council:",
    councilRoles.map((r) => ({
      id: r.id,
      name: r.name,
      roleId: r["role-id"],
    }))
  );

  const hasAppraisalCouncil = councilRoles.some(
    (r) => r.name === "Appraisal Council"
  );
  const hasChairman = councilRoles.some((r) => r.name === "Chairman");
  const hasSecretary = councilRoles.some((r) => r.name === "Secretary");

  console.log("📊 Current role status:", {
    hasAppraisalCouncil,
    hasChairman,
    hasSecretary,
  });

  if (newRole === "Appraisal Council") {
    console.log("🎯 Target role: Appraisal Council");
    // Update to Appraisal Council
    if (hasChairman) {
      // Delete Chairman role
      const chairmanUserRole = councilRoles.find((r) => r.name === "Chairman");
      if (chairmanUserRole) {
        console.log("🗑️ Deleting Chairman role:", chairmanUserRole.id);
        actions.push({
          action: "delete",
          accountId,
          roleId: chairmanUserRole["role-id"],
          roleName: "Chairman",
          userRoleId: chairmanUserRole.id,
        });
      }
    }
    if (hasSecretary) {
      // Delete Secretary role
      const secretaryUserRole = councilRoles.find(
        (r) => r.name === "Secretary"
      );
      if (secretaryUserRole) {
        console.log("🗑️ Deleting Secretary role:", secretaryUserRole.id);
        actions.push({
          action: "delete",
          accountId,
          roleId: secretaryUserRole["role-id"],
          roleName: "Secretary",
          userRoleId: secretaryUserRole.id,
        });
      }
    }
    if (!hasAppraisalCouncil) {
      // Create Appraisal Council role
      console.log("➕ Creating Appraisal Council role");
      actions.push({
        action: "create",
        accountId,
        roleId: appraisalCouncilRole.id,
        roleName: "Appraisal Council",
      });
    }
  } else if (newRole === "Chairman") {
    console.log("🎯 Target role: Chairman");
    if (!chairmanRole) {
      console.error("❌ Chairman role not found");
      throw new Error("Chairman role not found");
    }

    if (hasSecretary) {
      // Delete Secretary, add Chairman
      const secretaryUserRole = councilRoles.find(
        (r) => r.name === "Secretary"
      );
      if (secretaryUserRole) {
        console.log("🗑️ Deleting Secretary role:", secretaryUserRole.id);
        actions.push({
          action: "delete",
          accountId,
          roleId: secretaryUserRole["role-id"],
          roleName: "Secretary",
          userRoleId: secretaryUserRole.id,
        });
      }
    }

    if (!hasAppraisalCouncil) {
      // Create Appraisal Council role
      console.log("➕ Creating Appraisal Council role");
      actions.push({
        action: "create",
        accountId,
        roleId: appraisalCouncilRole.id,
        roleName: "Appraisal Council",
      });
    }

    if (!hasChairman) {
      // Create Chairman role
      console.log("➕ Creating Chairman role");
      actions.push({
        action: "create",
        accountId,
        roleId: chairmanRole.id,
        roleName: "Chairman",
      });
    }
  } else if (newRole === "Secretary") {
    console.log("🎯 Target role: Secretary");
    if (!secretaryRole) {
      console.error("❌ Secretary role not found");
      throw new Error("Secretary role not found");
    }

    if (hasChairman) {
      // Delete Chairman, add Secretary
      const chairmanUserRole = councilRoles.find((r) => r.name === "Chairman");
      if (chairmanUserRole) {
        console.log("🗑️ Deleting Chairman role:", chairmanUserRole.id);
        actions.push({
          action: "delete",
          accountId,
          roleId: chairmanUserRole["role-id"],
          roleName: "Chairman",
          userRoleId: chairmanUserRole.id,
        });
      }
    }

    if (!hasAppraisalCouncil) {
      // Create Appraisal Council role
      console.log("➕ Creating Appraisal Council role");
      actions.push({
        action: "create",
        accountId,
        roleId: appraisalCouncilRole.id,
        roleName: "Appraisal Council",
      });
    }

    if (!hasSecretary) {
      // Create Secretary role
      console.log("➕ Creating Secretary role");
      actions.push({
        action: "create",
        accountId,
        roleId: secretaryRole.id,
        roleName: "Secretary",
      });
    }
  }

  console.log(
    "📝 Generated actions:",
    actions.map((a) => ({
      action: a.action,
      roleName: a.roleName,
      roleId: a.roleId,
      userRoleId: a.userRoleId,
    }))
  );

  return actions;
}

/**
 * Determine delete actions for removing a member
 */
export function determineMemberDeleteActions(
  currentUserRoles: UserRole[],
  appraisalCouncilId: string,
  allMembers: UserRole[]
): MemberRoleUpdate[] {
  console.log("🗑️ Determining member delete actions:", {
    appraisalCouncilId,
    currentUserRolesCount: currentUserRoles.length,
    allMembersCount: allMembers.length,
  });

  const actions: MemberRoleUpdate[] = [];

  // Filter current roles for this appraisal council
  const councilRoles = currentUserRoles.filter(
    (role) => role["appraisal-council-id"] === appraisalCouncilId
  );

  console.log(
    "🏛️ Council roles to check:",
    councilRoles.map((r) => ({
      id: r.id,
      name: r.name,
      accountId: r["account-id"],
    }))
  );

  // Check if account-id matches another role in the council
  const accountId = currentUserRoles[0]?.["account-id"];
  if (!accountId) {
    console.log("❌ No account ID found");
    return actions;
  }

  const otherMembersWithSameAccount = allMembers.filter(
    (member) =>
      member["account-id"] === accountId &&
      member["appraisal-council-id"] === appraisalCouncilId
  );

  console.log("👥 Other members with same account:", {
    accountId,
    count: otherMembersWithSameAccount.length,
    members: otherMembersWithSameAccount.map((m) => ({
      id: m.id,
      name: m.name,
    })),
  });

  if (otherMembersWithSameAccount.length <= 1) {
    // Delete all roles for this account
    console.log("🗑️ Deleting all roles for account:", accountId);
    councilRoles.forEach((role) => {
      console.log(
        `🗑️ Adding delete action for role: ${role.name} (${role.id})`
      );
      actions.push({
        action: "delete",
        accountId,
        roleId: role["role-id"],
        roleName: role.name as AppraisalCouncilRoleType,
        userRoleId: role.id,
      });
    });
  } else {
    // Delete only the duplicate role (keep Appraisal Council)
    console.log("🗑️ Deleting duplicate role (keeping Appraisal Council)");
    const duplicateRole = councilRoles.find(
      (r) => r.name !== "Appraisal Council"
    );
    if (duplicateRole) {
      console.log(
        `🗑️ Adding delete action for duplicate role: ${duplicateRole.name} (${duplicateRole.id})`
      );
      actions.push({
        action: "delete",
        accountId,
        roleId: duplicateRole["role-id"],
        roleName: duplicateRole.name as AppraisalCouncilRoleType,
        userRoleId: duplicateRole.id,
      });
    } else {
      console.log("ℹ️ No duplicate role found to delete");
    }
  }

  console.log(
    "📝 Generated delete actions:",
    actions.map((a) => ({
      action: a.action,
      roleName: a.roleName,
      userRoleId: a.userRoleId,
    }))
  );

  return actions;
}
