function(ctx) 
{ 
    id: ctx.identity.id,
    firstName: ctx.identity.traits.name.first, 
    lastName: ctx.identity.traits.name.last, 
    email: ctx.identity.traits.email 
}