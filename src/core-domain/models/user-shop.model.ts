

export class UserShopModel {

    constructor(public code: string, public name: string) { }
}




export class DefaultShop {
    constructor(public defaultShop: UserShopModel, public shops: UserShopModel[]) { }
}