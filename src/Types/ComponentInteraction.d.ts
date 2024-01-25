import { ButtonInteraction, CacheType, ChannelSelectMenuInteraction, MentionableSelectMenuInteraction, RoleSelectMenuInteraction, StringSelectMenuInteraction, UserSelectMenuInteraction } from "discord.js";

type ComponentInteraction =
    ButtonInteraction<CacheType> |
    StringSelectMenuInteraction<CacheType> |
    UserSelectMenuInteraction<CacheType> |
    RoleSelectMenuInteraction<CacheType> |
    MentionableSelectMenuInteraction<CacheType> |
    ChannelSelectMenuInteraction<CacheType>