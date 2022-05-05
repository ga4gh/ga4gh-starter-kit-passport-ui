// TRYING TO GET WEB HOOK WORKING [NOT WORKING YET]
function(ctx) 
{ 
    id: ctx.identity.id,
    firstName: ctx.identity.traits.name.first, 
    lastName: ctx.identity.traits.name.last, 
    email: ctx.identity.traits.email 
}