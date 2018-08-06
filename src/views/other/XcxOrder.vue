<template>
  <div>
    <textarea v-model="content"></textarea>
    <pre style="display:none" ref="pp">
中餐11:30-13:00

B楼-1F

【本帮菜窗口】酸菜鱼、水蒸蛋、小炒茶香干。

【粤菜窗口】红腰豆煮牛肉粒、清水笋炒肉丝、五香豆干。

【牛杂汤套餐窗口11:50】牛杂粉丝、雪菜牛肉煎饼、凉拌黄瓜。（新品、一楼餐厅最里面）

【健康菜窗口11:35】土豆蒸牛仔骨、木耳炒胡萝卜。（无碘盐餐线）

【户外餐厅套餐11:30-12:30】葱油焖明虾、咸肉娃娃菜。

【筒骨套餐→户外餐厅12:00】粉丝筒骨饭套餐。

【盖浇饭便当→报告厅对面11:35】牛肉土豆盖浇饭。

【台式卤肉饭→盖浇饭旁边11:30】台湾卤牛肉饭、卤蛋、清水藕片。

【汤品】红枣莲子汤、番茄蛋汤。

【蔬菜】菠菜。

B楼-2F

【煲仔饭套餐12:20】奥尔良烤翅煲仔饭。

【烧腊/卤水套餐11:30】蜜汁叉烧、玉米排骨汤、大蒜炒腐竹、清炒大白菜

【川湘菜窗口】麻辣鱼、陕西凉皮。

【港式茶点套餐12:30】港式奶茶、香葱鸡蛋肠粉、奶油蛋糕、香煎韭菜饺、荷包蛋、黑椒排骨。

【笼仔饭窗口11:50】五香牛肉、酒酿圆子羹。

【砂锅粥-锅仔旁11:30】皮蛋瘦肉粥。

【干锅窗口11:40】水煮牛柳锅仔、干锅土豆香辣虾。

【自助面档】盐水虾面、雪菜肉丝面。

【蔬菜】菠菜。

晚餐 18:00-19:30 

B楼-1F

【本帮菜窗口】香炸虾饼、干锅花菜、酸菜牛肉。

【牛杂汤套餐窗口18:00】牛杂粉丝、雪菜牛肉煎饼、凉拌黄瓜。（新品、一楼餐厅最里面）

【户外餐厅套餐18:00】蒜香蒸仔排、西红柿炒蛋。

【筒骨套餐→户外餐厅18:00】粉丝筒骨饭套餐。

【粤菜窗口】栗子红烧肉、菠萝焗翅、排黄瓜。

【盖浇饭窗口18:00】肉末四季豆盖浇饭。

【健康菜窗口18:00】板栗蒸排骨。（无碘盐餐线）

【台式卤肉饭→盖浇饭旁边18:00】台湾卤肉饭、卤蛋、樱桃萝卜。

【汤品】玉米甜汤、雪菜肉丝蛋汤。

【蔬菜】包心菜。

B楼-2F

【煲仔饭套餐18:00】奥尔良烤翅煲仔饭。

【烧腊/卤水套餐18:00】蜜汁叉烧、玉米排骨汤、卤蛋、清炒大白菜。

【川湘菜窗口】口水鸡、酸辣土豆丝。

【笼仔饭窗口18:00】五香牛肉、酒酿圆子羹。

【砂锅粥-锅仔旁18:00】皮蛋瘦肉粥。

【干锅窗口18:00】水煮牛柳锅仔、干锅土豆香辣虾。

【自助面档】尖椒炒蛋面、葱油芥兰面。

【蔬菜】包心菜。


    </pre>
    <el-button type="primary" @click="gan">转化</el-button>
    <el-card class="box-card">
      <p v-for="(item, index) in dishes" :key="'m'+index">
        {{item.type}} {{item.floor}} {{item.window}} {{item.name}}
      </p>
    </el-card>
    <div class="text">{{dishesJson}}</div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      content: '',
      dishes: [],
      dish: {
        name: '',
        type: '', // 中餐/晚餐
        floor: '', // 1F/2F
        window: '', // 窗口
        date: '' // 日期
      },
      dishesJson: ''
    }
  },
  mounted() {
    this.content = this.$refs.pp.innerHTML
  },
  methods: {
    gan() {
      const content = this.content
      const regZc = /中餐[\s\S]*(?=晚餐)/gi
      const regWc = /晚餐[\s\S]*/gi
      const zc = regZc.exec(content)[0]
      const wc = regWc.exec(content)[0]
      this.parseContent(zc, '中餐')
      this.parseContent(wc, '晚餐')
      const data = {
        data: this.dishes
      }
      this.dishesJson = JSON.stringify(data).replace(/\\n/gi, '')
    },
    parseContent(c, type) {
      const reg1F = /B楼-1F[\s\S]*(?=B楼-2F)/gi
      const reg2F = /B楼-2F[\s\S]*/gi
      const regRow = /【[^\n]*\n/gi // 匹配一行菜单
      const f1 = reg1F.exec(c)[0]
      const f2 = reg2F.exec(c)[0]
      const f1Row = f1.match(regRow)
      const f2Row = f2.match(regRow)
      this.parseDish(f1Row, type, '1F')
      this.parseDish(f2Row, type, '2F')
    },
    parseDish(row, type, floor) {
      row.forEach(v => {
        const f1w = v.split('】')[0] + '】'
        const f1dish = v.split('】')[1]
        f1dish.split('、').forEach(v => {
          let dish = {
            name: v,  // 菜肴名称
            type: type, // 中餐/晚餐
            floor: floor, // 1F/2F
            window: f1w // 窗口
          }
          this.dishes.push(dish)
          dish = {}
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
textarea{
  width:100%;
  height:300px;
}
.text{
  margin:50px 20px;
}
</style>


