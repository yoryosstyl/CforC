/**
 * member controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::member.member', ({ strapi }) => ({
  // Override the default update to allow updating auth fields
  async update(ctx) {
    const { id } = ctx.params;
    const { data } = ctx.request.body;

    // Allow updating sensitive auth fields through the API
    const entity = await strapi.entityService.update('api::member.member', id, {
      data,
    });

    return { data: entity };
  },
}));
