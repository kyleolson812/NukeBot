const {
    Client,
    Interaction,
    ApplicationCommandOptionType,
    SlashCommandBuilder,
    PermissionFlagsBits,
  } = require('discord.js');
  
  module.exports = {
    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     */
	data: new SlashCommandBuilder()
	.setName('kick')
	.setDescription('Select a member and kick them (but not really).')
	.addUserOption(option => option.setName('target-user').setDescription('The member to kick.').setRequired(true)),
    async execute(interaction) {
      const targetUserId = interaction.options.get('target-user').value;
      const reason =
        interaction.options.get('reason')?.value || 'No reason provided';
  
      await interaction.deferReply();
  
      const targetUser = await interaction.guild.members.fetch(targetUserId);
  
      if (!targetUser) {
        await interaction.editReply("That user doesn't exist in this server.");
        return;
      }
  
      if (targetUser.id === interaction.guild.ownerId) {
        await interaction.editReply(
          "You can't ban that user because they're the server owner."
        );
        return;
      }
  
      const targetUserRolePosition = targetUser.roles.highest.position; // Highest role of the target user
      const requestUserRolePosition = interaction.member.roles.highest.position; // Highest role of the user running the cmd
      const botRolePosition = interaction.guild.members.me.roles.highest.position; // Highest role of the bot
  
      if (targetUserRolePosition >= requestUserRolePosition) {
        await interaction.editReply(
          "You can't ban that user because they have the same/higher role than you."
        );
        return;
      }
  
      if (targetUserRolePosition >= botRolePosition) {
        await interaction.editReply(
          "I can't ban that user because they have the same/higher role than me."
        );
        return;
      }
  
      // Ban the targetUser
      try {
        await targetUser.kick({ reason });
        await interaction.editReply(
          `User ${targetUser} was kicked\nReason: ${reason}`
        );
      } catch (error) {
        console.log(`There was an error when banning: ${error}`);
      }
    },
  

  };
  